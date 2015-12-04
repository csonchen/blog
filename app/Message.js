/**
 * Created by chensheng on 15/12/2.
 */
var Imap = require('imap')
  , inspect = require('util').inspect
  , Util = require('./Util')
  , DB = require('./DB');

var Message = {
  subject: 0,
  froms: '',
  mailStatus: 0,

  msgOnHandler: function (stream) {
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

  msgAttrHandler: function (prefix, attrs, imap) {
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
      f.on('message', Util.buildAttMessageFunction(attachment));
    }
  },

  msgEndHandler: function (prefix) {
    DB.saveMail();
    console.log(prefix + 'Finished email.');
  }
};

module.exports = Message;