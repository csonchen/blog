/**
 * Created by chensheng on 15/2/10.
 */
//模块加载
var Imap = require('imap'),
    inspect = require('util').inspect,
    path = require('path'),
    base64 = require('base64-stream'),
    adm_zip = require('adm-zip'),
    node_rar = require('node-rar'),
    nodemailer = require('nodemailer'),
    fs = require('fs'),
    config = require('./config'),
    log = require('./log4j').logger('index');

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
    ipaPath = config.path.ipa;

//IMAP服务器连接配置
var imap = new Imap({
    user: config.imap.user,
    password: config.imap.password,
    host: config.imap.host,
    port: config.imap.port,
    tls: config.imap.tls
});

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
    var outFilePath = path.normalize(config.attachmentsPath),//路径
        outFile = outFilePath + '/' + filename;//文件全名

    return function (msg, seqno) {
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function (stream, info) {
            log.info(prefix + 'Streaming this attachment to file', filename, info);
            //输出文件
            var writeStream = fs.createWriteStream(outFile);

            writeStream.on('finish', function () {
                log.info(prefix + 'Done writing to file %s', filename);
                //解压
                unZip(config.attachmentsPath + '/' + filename);
            });

            //判断编码格式，转码输出
            if (encoding === 'BASE64') {
                stream.pipe(base64.decode()).pipe(writeStream);
            } else {
                stream.pipe(writeStream);
            }
        });
        msg.once('end', function () {
            log.info(prefix + 'Finished attachment %s', filename);
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
    unzip.extractAllTo(config.attachmentsPath, true);
    //遍历目录,统计安装包(分离.zip后缀)
    walk(path.replace('.zip',''));
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
            log.error(error);
        } else {
            log.info('Message sent: ' + info.response);
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
        openInbox(function (err, box) {
            if (err) {
                log.error(err);
                throw err;
            }
            //按条件查找
            imap.search(['UNSEEN', ['SINCE', 'Jan 30, 2015']], function (err, results) {
                if (err) {
                    log.error(err);
                    throw err;
                }
                var f = imap.seq.fetch(results, {
                    //'' ：邮件全部信息
                    bodies: 'HEADER.FIELDS (FROM)',
                    struct: true
                });

                f.on('message', function (msg, seqno) {
                    var prefix = '(#' + seqno + ')';

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
                        });
                    });

                    msg.once('attributes', function (attrs) {
                        var attachments = findAttachmentParts(attrs.struct);

                        log.info(prefix + 'Has attachments: %d', attachments.length);

                        //读取附件并下载
                        for (var i = 0, len = attachments.length; i < len; ++i) {
                            var attachment = attachments[i];
                            log.info(prefix + 'Fetching attachment %s', attachment.params.name);
                            var f = imap.fetch(attrs.uid, {
                                bodies: [attachment.partID],
                                struct: true
                            });
                            f.on('message', buildAttMessageFunction(attachment));
                        }
                    });

                    msg.once('end', function () {
                        log.info(prefix + 'Finished email.');
                    });
                });

                //输出连接错误信息
                f.once('error', function (err) {
                    log.error('Fetch error: ' + err);
                });

                //执行完毕，关闭imap连接
                f.once('end', function () {
                    log.info('Done fetching all messages!');
                    //发送邮件
                    //sendMail();
                    imap.end();
                });
            });
        });
    });

    imap.once('error', function (err) {
        log.error(err);
    });

    imap.once('end', function () {
        log.info('Connection ended');
    });

    imap.connect();
}

startPro();
