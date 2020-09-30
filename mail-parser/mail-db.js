/**
 * Created by chensheng on 15/2/12.
 */
//模块加载
var Imap = require('imap'),
    inspect = require('util').inspect,
    path = require('path'),
    base64 = require('base64-stream'),
    adm_zip = require('adm-zip'),
    nodemailer = require('nodemailer'),
    fs = require('fs'),
    config = require('./config'),
    sqlite3 = require('sqlite3').verbose();

//建立数据库
var db = new sqlite3.Database(config.db);

//发送人地址
var froms = '';

//文件路径数组
var apkPathList = [],
    ipaPathList = [];

//文件数组
var apkList = [],
    ipaList = [];

//应用程序安装包存储路径
var apkPath = config.path.apk,
    ipaPath = config.path.ipa,
    attachmentsPath = config.path.attachments;

//启动表参数 status 0：成功；1：失败
var startTime, endTime,
    lastMailID = 1, status = 0;

//邮件表参数 status 0：成功；1：失败
var runid, mailStatus = 0, subject = 0;

//IMAP服务器连接配置
var imap = new Imap({
    user: config.imap.user,
    password: config.imap.password,
    host: config.imap.host,
    port: config.imap.port,
    tls: config.imap.tls
});

/**
 * 日期格式化
 * @param format
 * @returns {*}
 */
Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

/**
 * 遍历目录，筛选安装包文件
 * @param path
 */
function walk(path) {
    //当前目录
    var dirs = fs.readdirSync(path),
        flag = '';
    dirs.forEach(function (item) {
        flag = fs.statSync(path + '/' + item).isDirectory();
        //判断是否为目录
        if (flag) {
            walk(path + '/' + item);
        } else {
            //文件后缀
            var suf = item.split('.')[1];
            if (suf === 'apk') {//安卓apk
                apkPathList.push(path + '/' + item);
                apkList.push(item);
            } else if (suf === 'ipa') {//苹果ipa
                ipaPathList.push(path + '/' + item);
                ipaList.push(item);
            }
        }
    });
}

/**
 * 文件复制
 * @param array
 *
 */
function copy(apkPathArray, ipaPathArray) {
    var apkArr = apkPathArray,
        ipaArr = ipaPathArray,
        readable, writable;
    //复制apk
    for (var i = 0, len = apkArr.length; i < len; i++) {
        readable = fs.createReadStream(apkPathList[i]);
        writable = fs.createWriteStream(apkPath + '/' + apkList[i]);
        readable.pipe(writable);
    }
    //复制ipa
    for (var i = 0, len = ipaArr.length; i < len; i++) {
        readable = fs.createReadStream(ipaPathList[i]);
        writable = fs.createWriteStream(ipaPath + '/' + ipaList[i]);
        readable.pipe(writable);
    }
}

/**
 * 查找附件
 * @param struct
 * @param attachments
 * @returns {*|Array}
 *
 */
function findAttachmentParts(struct, attachments) {
    attachments = attachments || [];
    for (var i = 0, len = struct.length; i < len; ++i) {
        //获取subtype属性 'x-zip-compressed' : zip格式
        var subtype = struct[i].subtype;
        if (Array.isArray(struct[i])) {
            findAttachmentParts(struct[i], attachments);
        } else {
            if (subtype && ['x-zip-compressed'].indexOf(subtype) > -1) {
                //添加附件
                attachments.push(struct[i]);
            }
        }
    }
    return attachments;
}

/**
 * 下载附件
 * @param attachment
 * @returns {Function}
 *
 */
function buildAttMessageFunction(attachment) {
    //文件名
    var filename = attachment.params.name;
    var encoding = attachment.encoding;
    //邮件附件保存路径（未对路径进行判断处理。。。）
    var outFilePath = path.normalize(attachmentsPath),//路径
        outFile = outFilePath + '/' + filename;//文件全名

    return function (msg, seqno) {
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function (stream, info) {
            console.log(prefix + 'Streaming this attachment to file', filename, info);
            //输出文件
            var writeStream = fs.createWriteStream(outFile);

            writeStream.on('finish', function () {
                console.log(prefix + 'Done writing to file %s', filename);
                //解压
                unZip(attachmentsPath + '/' + filename);
            });

            //判断编码格式，转码输出
            if (encoding === 'BASE64') {
                stream.pipe(base64.decode()).pipe(writeStream);
            } else {
                stream.pipe(writeStream);
            }
        });
        msg.once('end', function () {
            console.log(prefix + 'Finished attachment %s', filename);
        });
    };
}

/**
 * 解压zip文件
 * @param src
 * @param dst
 */
function unZip(path) {
    var unzip = new adm_zip(path);
    //解压zip文件有则覆盖
    unzip.extractAllTo(attachmentsPath, true);
    //遍历目录,统计安装包(分离.zip后缀)
    walk(path.replace('.zip', ''));
    //复制文件
    copy(apkPathList, ipaPathList);
}

/**
 * 分离邮箱地址
 * @param str
 * @returns {Boolean|*|Array|{index: number, input: string}|boolean}
 * @private
 */
function splitMailAdr(str) {
    var _ = /[^<@]+@[^>]+/g;
    return str.match(_);
}

/**
 * 发送反馈邮件
 */
function sendMail() {
    var transporter = nodemailer.createTransport({
        service: config.nodemailer.service,
        auth: config.nodemailer.auth
    });

    var mailOptions = {
        from: config.mailOptions.from,
        to: froms,
        subject: config.mailOptions.subject,
        text: config.mailOptions.text,
        html: config.mailOptions.html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}

/**
 * start
 */
function startPro() {
    imap.once('ready', function () {
        //程序启动时间
        startTime = new Date().format('yyyy-MM-dd hh:mm:ss');

        openInbox(function (err, box) {
            if (err) {
                status = 1;
                throw err;
            }
            db.serialize(function(){
                db.get('select * from mailpro order by id desc LIMIT 1',function(err,res){
                    var preLastMailID = JSON.stringify(res.last_mailID);
                    console.log(preLastMailID);
                    //按条件查找(preLastMailID:* 从上次读取的最后一条开始到邮箱最后一封邮件结束)
                    var f = imap.seq.fetch("" + preLastMailID + ":*", {
                        bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                        struct: true
                    });

                    f.on('message', function (msg, seqno) {
                        var prefix = '(#' + seqno + ')';
                        //记录读取的邮件编号，会覆盖掉最后读取的邮件编号
                        lastMailID = seqno;

                        msg.on('body', function (stream, info) {
                            var buffer = '';

                            stream.on('data', function (chunk) {
                                buffer += chunk.toString('utf8');
                            });

                            stream.once('end', function () {
                                //记录发送人地址
                                var from = inspect(Imap.parseHeader(buffer).from);
                                from = splitMailAdr(from);
                                froms = from + ',' + froms;
                                //记录邮件主题
                                subject = inspect(Imap.parseHeader(buffer).subject);
                            });
                        });

                        msg.once('attributes', function (attrs) {
                            //查找附件
                            var attachments = findAttachmentParts(attrs.struct);

                            console.log(prefix + 'Has attachments: %d', attachments.length);

                            //读取附件并下载
                            for (var i = 0, len = attachments.length; i < len; ++i) {
                                var attachment = attachments[i];
                                console.log(prefix + 'Fetching attachment %s', attachment.params.name);
                                var f = imap.fetch(attrs.uid, {
                                    bodies: [attachment.partID],
                                    struct: true
                                });
                                f.on('message', buildAttMessageFunction(attachment));
                            }
                        });

                        msg.once('end', function () {
                            //数据插入邮件表
                            db.serialize(function () {
                                //这里待修改(观察者模式).....
                                db.get('select max(id) as maxid from mailpro', function (err, res) {
                                    if (err) {
                                        throw err;
                                    }
                                    //当前启动表最后运行编号
                                    runid = res.maxid;
                                    //判断是否为空表
                                    if (runid === null) {
                                        runid = 1;
                                    } else {
                                        runid = res.maxid + 1;
                                    }
                                    var stmt = db.prepare('INSERT INTO mail(runid,status,subject) ' +
                                    'values(?,?,?);');
                                    stmt.run([runid, mailStatus, subject]);
                                    stmt.finalize();
                                });
                            });
                            console.log(prefix + 'Finished email.');
                        });
                    });

                    //输出连接错误信息
                    f.once('error', function (err) {
                        status = 1;
                        console.log('Fetch error: ' + err);
                    });

                    //执行完毕，关闭imap连接
                    f.once('end', function () {
                        console.log('Done fetching all messages!');
                        //发送邮件
                        //sendMail();
                        imap.end();
                        //记录程序结束时间
                        endTime = new Date().format('yyyy-MM-dd hh:mm:ss');
                        //数据记录启动表
                        db.serialize(function () {
                            var stmt = db.prepare('INSERT INTO mailpro(start_time,end_time,last_mailID,status) ' +
                            'values(?,?,?,?);');
                            stmt.run([startTime, endTime, lastMailID, status]);
                            stmt.finalize();
                        });
                    });
                });
            });
        });
    });

    imap.once('error', function (err) {
        status = 1;
        console.log(err);
    });

    imap.once('end', function () {
        console.log('Connection ended');
    });

    imap.connect();
}

startPro();
