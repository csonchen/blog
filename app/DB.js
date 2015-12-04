/**
 * Created by chensheng on 15/12/2.
 */
'use strict';

var DBHelper = require('./DBHelper')
  , Message = require('./Message');

var DB = {
  saveMail: function () {
    var DBSqlite = DBHelper.getSqliteDB();
    console.log(1);

    DBSqlite.serialize(function () {
      DBSqlite.get('SELECT max(id) AS maxid FROM mailpro', function (err, res) {
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

        var stmt = DBSqlite.prepare(sql);
        stmt.run(params);
        stmt.finalize();
      });
    });
    //console.log('1-1');
    DBSqlite.close();
    //console.log('1-2');
  },

  saveMailPro: function (params) {
    var DBSqlite = DBHelper.getSqliteDB()
      , sql = "INSERT INTO mailpro(start_time,end_time,last_mailID,status) VALUES(?,?,?,?);";
    console.log(2);

    var stmt = DBSqlite.prepare(sql);
    stmt.run(params);
    stmt.finalize();
    //DBSqlite.close();
  },

  saveAttachment: function (params) {
    var code = params[0];
    var DBSqlite = DBHelper.getSqliteDB()
      , querySql = "SELECT COUNT('X') AS num FROM attachment WHERE code = '" + code + "'"
      , insertSql = "INSERT INTO attachment(code,url) VALUES(?,?);";
    console.log(3);

    DBSqlite.get(querySql, function (err, res) {
      var num = res.num;
      if (num == 0) { // 包不存在
        var stmt = DBSqlite.prepare(insertSql);
        stmt.run(params);
        stmt.finalize();
      }
    });
    //DBSqlite.close();
  }
};

module.exports = DB;

