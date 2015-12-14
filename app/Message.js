/**
 * Created by chensheng on 15/12/11.
 */
var Imap = require('imap')
  , inspect = require('util').inspect
  , Util = require('./Util')
  , MailService = require('./MailService')
  , path = require('path')
  , fs = require('fs')
  , admZip = require('adm-zip')
  , base64 = require('base64-stream')
  , config = require('../config.json')
  , moment = require('moment')
  , Item = require('./Item');

class Message {
  constructor(imap, fetch) {
    this.imap = imap;
    this.fetch = fetch;
    this.msg = '';
    this.seqno = '';

    fetch.on('message', this.readMessage.bind(this));
    fetch.once('end', this.endFetch(this));
  }

  readMessage(imap, msg, seqno) {
    var prefix = '(#' + seqno + ')';
    //记录读取的邮件编号，会覆盖掉最后读取的邮件编号
    item.lastMailID = seqno;

    msg.on('body', function (stream) {
      var buffer = '';

      stream.on('data', function (chunk) {
        buffer += chunk.toString('utf8');
      });

      stream.once('end', function () {
        //记录发送人地址
        var from = inspect(Imap.parseHeader(buffer).from);
        from = Util.splitMailAdr(from)[0];
        Message.froms = from + ',' + Message.froms;
        //记录邮件主题
        Message.subject = inspect(Imap.parseHeader(buffer).subject);
      });
    });

    msg.once('attributes', function (attrs) {
      // 查找附件
      var attachments = Util.findAttachmentParts(attrs.struct);
      console.log(prefix + 'Has attachments: %d', attachments.length);

      //读取附件并下载
      for (var i = 0, len = attachments.length; i < len; ++i) {
        var attachment = attachments[i];
        console.log(prefix + 'Fetching attachment %s', attachment.params.name);
        var f = imap.fetch(attrs.uid, {
          bodies: [attachment.partID],
          struct: true
        });
        f.on('message', Util.buildAttMessageFunction(attachment, db));
      }
    });

    msg.once('end', function () {
      db.serialize(function () {
        db.get('select max(id) as maxid from mailpro', function (err, res) {
          if (err) {
            throw err;
          }
          //当前启动表最后运行编号
          var runid = res.maxid;
          //判断是否为空表
          if (runid === null) {
            runid = 1;
          } else {
            runid = res.maxid + 1;
          }

          // 插入邮件表
          MailService.saveMail(db, runid, Message.mailStatus, Message.subject);
        });
      });
      console.log(prefix + 'Finished email.');
    });
  }

  endFetch(imap) {
    console.log('Done fetching all messages!');
    //发送邮件
    Item.sendMail();
    imap.end();
    //记录程序结束时间
    Item.endTime = moment.format('YYYY-MM-DD HH:mm:ss');

    //数据记录启动表
    var params = [Item.startTime, Item.endTime, Item.lastMailID, Item.status];
    MailService.saveMailPro(params);
  }
}

module.exports = Message;