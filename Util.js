/**
 * Created by chensheng on 15/11/24.
 */
// 模块加载
var path = require('path')
  , base64 = require('base64-stream')
  , admZip = require('adm-zip')
  , fs = require('fs')
  , config = require('./config');

var Util = {
  apkPathList: [],
  ipaPathList: [],
  apkList: [],
  ipaList: [],

  splitMailAdr: function (str) {
    var _ = /[^<@]+@[^>]+/g;
    return str.match(_);
  },

  findAttachmentParts: function (struct, attachments) {
    attachments = attachments || [];
    for (var i = 0, len = struct.length; i < len; ++i) {
      //获取subtype属性 'x-zip-compressed' : zip格式
      var subtype = struct[i].subtype;
      if (Array.isArray(struct[i])) {
        this.findAttachmentParts(struct[i], attachments);
      } else {
        if (subtype && ['x-zip-compressed'].indexOf(subtype) > -1) {
          //添加附件
          attachments.push(struct[i]);
        }
      }
    }
    return attachments;
  },

  buildAttMessageFunction: function (attachment) {
    //文件名
    var filename = attachment.params.name;
    var encoding = attachment.encoding;
    //邮件附件保存路径
    var outFilePath = path.normalize(config.path.attachments),//路径
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
          Util.unZip(config.path.attachments + '/' + filename);
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
  },

  unZip: function (path) {
    var unzip = new admZip(path);
    // 解压zip文件，存在则自动覆盖
    unzip.extractAllTo(config.path.attachments, true);
    // 遍历目录，统计安装包（分离.zip后缀）
    Util.walk(config.path.attachments);
    // 复制文件
    Util.copy(Util.apkPathList, Util.ipaPathList);
  },

  copy: function (apkPathArray, ipaPathArray) {
    console.log(apkPathArray);
    console.log(ipaPathArray);
    var apkArr = apkPathArray
      , ipaArr = ipaPathArray
      , readable, writable;
    // 复制apk
    for (var i = 0, len = apkArr.length; i < len; i++) {
      readable = fs.createReadStream(Util.apkPathList[i]);
      writable = fs.createWriteStream(config.path.apk + '/' + Util.apkList[i]);
      readable.pipe(writable);
    }

    // 复制ipa
    for (var i = 0, len = ipaArr.length; i < len; i++) {
      readable = fs.createReadStream(Util.ipaPathList[i]);
      writable = fs.createWriteStream(config.path.ipa + '/' + Util.ipaList[i]);
      readable.pipe(writable);
    }
  },

  walk: function (path) {
    // 当前目录
    var dirs = fs.readdirSync(path),
      flag = '';

    dirs.forEach(function (item) {
      flag = fs.statSync(path + '/' + item).isDirectory();
      // 判断是否为目录
      if (flag) {
        Util.walk(path + '/' + item);
      } else {
        // 文件后缀
        var suf = item.split('.')[1];
        if (suf === 'apk') { // android
          Util.apkPathList.push(path + '/' + item);
          Util.apkList.push(item);
        } else if (suf === 'ipa') { // ios
          Util.ipaPathList.push(path + '/' + item);
          Util.ipaList.push(item);
        }
      }
    });
  }
};
module.exports = Util;