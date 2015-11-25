/**
 * Created by chensheng on 15/11/23.
 */

// 模块加载
var Imap = require('imap')
  , nodemailer = require('nodemailer')
  , config = require('./config')
  , Message = require('./Message')
  , DB = require('./DB');

var item = {
  lastMailID: 1,
  status: 0,
  mailStatus: 0,
  subject: 0,
  startTime: '',
  endTime: '',

  getImap: function () {
    return new Imap({
      user: config.imap.user,
      password: config.imap.password,
      host: config.imap.host,
      port: config.imap.port,
      tls: config.imap.tls
    });
  },

  sendMail: function () {
    var transporter = nodemailer.createTransport({
      service: config.nodemailer.service,
      auth: config.nodemailer.auth
    });

    var mailOptions = {
      from: config.mailOptions.from,
      to: Message.froms,
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
  },

  getFetch: function (imap, preLastMailID) {
    return imap.seq.fetch("" + preLastMailID + ":*", {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    });
  },

  onFetHandler: function (fetch, db, imap, msg, seqno) {
    var prefix = '(#' + seqno + ')';
     //记录读取的邮件编号，会覆盖掉最后读取的邮件编号
    item.lastMailID = seqno;

    msg.on('body', function (stream, info) {
      Message.msgOnHandler(stream, info);
    });

    msg.once('attributes', function (attrs) {
      Message.msgAttrHandler(prefix, attrs, imap, db);
    });

    msg.once('end', function () {
      Message.msgEndHandler(db, prefix);
    });
  },

  errFetHandler: function (err) {
    item.status = 1;
    console.log('Fetch error: ' + err);
  },

  endFetHandler: function (imap, db) {
    console.log('Done fetching all messages!');
    //发送邮件
    item.sendMail();
    imap.end();
    //记录程序结束时间
    item.endTime = new Date().format('yyyy-MM-dd hh:mm:ss');

    //数据记录启动表
    DB.saveMailPro(db, item.startTime, item.endTime, item.lastMailID, item.status);
  }
};

module.exports = item;