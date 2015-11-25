/**
 * Created by chensheng on 15/11/24.
 */
var Imap = require('imap')
  , inspect = require('util').inspect
  , Util = require('./Util')
  , DB = require('./DB');

var Message = {
  subject: 0,
  froms: '',
  mailStatus: 0,

  msgOnHandler: function (stream, info) {
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
  },

  msgAttrHandler: function (prefix, attrs, imap, db) {
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
  },

  msgEndHandler: function (db, prefix) {
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
        DB.saveMail(db, runid, Message.mailStatus, Message.subject);
      });
    });
    console.log(prefix + 'Finished email.');
  }
};

module.exports = Message;