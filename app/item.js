/**
 * Created by chensheng on 15/12/2.
 */
// 模块加载
var Imap = require('imap')
  , nodemailer = require('nodemailer')
  , config = require('../config.json')
  , Message = require('./Message2')
  , DBHelper = require('./DBHelper')
  , moment = require('moment');

class Item {
  constructor(imap) {
    this.imap = imap;
    imap.once('ready', this.onReady.bind(this));
    imap.once('error', this.errorFetch(this));
    imap.once('end', this.endFetch.bind(this));
  }

  onReady(imap) {
    // 程序启动时间
    var startTime = moment().format('YYYY-MM-DD HH:mm:ss');
    Item.startTime = startTime;

    imap.openBox('INBOX', true, function () {
      var DB = DBHelper.getSqliteDB()
        , sql = "SELECT * FROM mailpro ORDER BY id DESC LIMIT 1";
      DB.get(sql, function (err, res) {
        var preLastMailID = JSON.stringify(res.lastMailID);

        //var fetch = imap.seq.fetch("" + preLastMailID + ":*", {
        //  bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
        //  struct: true
        //});

        // 读取邮件操作
        var fetch = imap.seq.fetch("843:*", {
          bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
          struct: true
        });

        fetch.on('message', function (msg, seqno) {
          Item.onFetHandler(fetch, imap, msg, seqno);
        });

        fetch.once('error', Item.errFetHandler);

        fetch.once('end', function () {
          Item.endFetHandler(imap);
        });
      });
    });
  }

  endFetch() {
    console.log('Connection ended');
  }

  errorFetch(err) {
    console.log(err);
  }

  static sendMail() {
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
  }
}

//var item = {
//  lastMailID: 1,
//  status: 0,
//  mailStatus: 0,
//  subject: 0,
//  startTime: '',
//  endTime: '',
//
//
//  onFetHandler: function (fetch, imap, msg, seqno) {
//    var prefix = '(#' + seqno + ')';
//    //记录读取的邮件编号，会覆盖掉最后读取的邮件编号
//    item.lastMailID = seqno;
//
//    Message.prefix = prefix;
//
//    msg.on('body', function (stream, info) {
//      //Message.msgOnHandler(stream, info);
//    });
//
//    msg.once('attributes', function (attrs) {
//      Message.msgAttrHandler(prefix, attrs, imap);
//    });
//
//    msg.once('end', function () {
//      Message.msgEndHandler(prefix);
//    });
//  },
//};

module.exports = Item;