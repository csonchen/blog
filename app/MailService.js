/**
 * Created by chensheng on 15/12/2.
 */

var DBHelper = require('./DBHelper')
  , Message = require('./Message');

class MailService {
  saveMail() {
    var DB = DBHelper.getSqliteDB();

    DB.serialize(function () {
      DB.get('SELECT max(id) AS maxid FROM mailpro', function (err, res) {
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
        var params = [runid, Message.mailStatus, Message.subject];
        var sql = "INSERT INTO mail(runid,status,subject) VALUES(?,?,?);";

        var stmt = DB.prepare(sql);
        stmt.run(params);
        stmt.finalize();
      });
    });
  }

  saveMailPro(params) {
    var DB = DBHelper.getSqliteDB()
      , sql = "INSERT INTO mailpro(start_time,end_time,last_mailID,status) VALUES(?,?,?,?);";

    var stmt = DB.prepare(sql);
    stmt.run(params);
    stmt.finalize();
  }

  saveAttachment(params) {
    var code = params[0];
    var DB = DBHelper.getSqliteDB()
      , querySql = "SELECT COUNT('X') AS num FROM attachment WHERE code = '" + code + "'"
      , insertSql = "INSERT INTO attachment(code,url) VALUES(?,?);";

    DB.get(querySql, function (err, res) {
      var num = res.num;
      if (num == 0) { // 包不存在
        var stmt = DB.prepare(insertSql);
        stmt.run(params);
        stmt.finalize();
      }
    });
  }
}

module.exports = MailService;

