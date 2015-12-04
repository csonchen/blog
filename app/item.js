/**
 * Created by chensheng on 15/12/2.
 */
// 模块加载
var Imap = require('imap')
  , nodemailer = require('nodemailer')
  , config = require('../config.json')
  , Message = require('./Message')
  , DB = require('./DB')
  , moment = require('moment');

var item = {
  lastMailID: 1,
  status: 0,
  mailStatus: 0,
  subject: 0,
  startTime: '',
  endTime: '',

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

  onFetHandler: function (fetch, imap, msg, seqno) {
    var prefix = '(#' + seqno + ')';
    //记录读取的邮件编号，会覆盖掉最后读取的邮件编号
    item.lastMailID = seqno;

    msg.on('body', function (stream, info) {
      Message.msgOnHandler(stream, info);
    });

    msg.once('attributes', function (attrs) {
      Message.msgAttrHandler(prefix, attrs, imap);
    });

    msg.once('end', function () {
      Message.msgEndHandler(prefix);
    });
  },

  errFetHandler: function (err) {
    item.status = 1;
    console.log('Fetch error: ' + err);
  },

  endFetHandler: function (imap) {
    console.log('Done fetching all messages!');
    //发送邮件
    //item.sendMail();
    imap.end();
    //记录程序结束时间
    item.endTime = moment().format('YYYY-MM-DD HH:mm:ss');

    //数据记录启动表
    var params = [item.startTime, item.endTime, item.lastMailID, item.status];
    DB.saveMailPro(params);
  },

  setStartTime: function (startTime) {
    item.startTime = startTime;
  },

  setStatus: function (status) {
    item.status = status;
  }
};

module.exports = item;