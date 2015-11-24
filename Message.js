/**
 * Created by chensheng on 15/11/24.
 */
var Imap = require('imap')
  , inspect = require('util').inspect
  , item = require('./item')
  , Util = require('./Util');

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
      from = Util.splitMailAdr(from);
      this.froms = from + ',' + this.froms;
      //记录邮件主题
      this.subject = inspect(Imap.parseHeader(buffer).subject);
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
        var stmt = db.prepare('INSERT INTO mail(runid,status,subject) ' +
        'values(?,?,?);');
        stmt.run([runid, this.mailStatus, this.subject]);
        stmt.finalize();
      });
    });
    console.log(prefix + 'Finished email.');
  }
};

module.exports = Message;