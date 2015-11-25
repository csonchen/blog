/**
 * Created by chensheng on 15/11/25.
 */
var DB = {
  saveMail: function (db, runid, mailStatus, subject) {
    var stmt = db.prepare('INSERT INTO mail(runid,status,subject) ' +
    'values(?,?,?);');
    stmt.run([runid, mailStatus, subject]);
    stmt.finalize();
  },

  saveMailPro: function (db, startTime, endTime, lastMailID, status) {
    db.serialize(function () {
      var stmt = db.prepare('INSERT INTO mailpro(start_time,end_time,last_mailID,status) ' +
      'values(?,?,?,?);');
      stmt.run([startTime, endTime, lastMailID, status]);
      stmt.finalize();
    });
  },

  saveAttachment: function (db, code, url) {
    var querySql = "SELECT count('X') AS num FROM attachment WHERE code = '" + code + "'";
    db.get(querySql, function (err, res) {
      var num = res.num;
      if (num == 0) { // 包不存在
        var insertSql = "INSERT INTO attachment(code,url) VALUES(?,?);"
          , stmt = db.prepare(insertSql);
        stmt.run([code, url]);
        stmt.finalize();
      }
    });
  }
};

module.exports = DB;