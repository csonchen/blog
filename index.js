/**
 * Created by chensheng on 15/11/23.
 */
var item = require('./item')
  , Promise = require('promise')
  , sqlite3 = require('sqlite3').verbose()
  , config = require('./config');

/**
* 日期格式化
* @param format
* @returns {*}
*/
Date.prototype.format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
};

(function () {
  var imap = item.getImap()
    , db = new sqlite3.Database(config.db)
    , serialize = Promise.resolve(db.serialize);

  function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
  }

  imap.once('ready', function () {
    // 程序启动时间
    item.startTime = new Date().format('yyyy-MM-dd hh:mm:ss');

    openInbox(function (err, box) {
      if (err) {
        item.status = 1;
        throw err;
      }

      serialize
        .then(db.run('INSERT INTO mailpro("last_mailID","status") VALUES(1,0)'))
        .then(function () {
          db.get('select * from mailpro order by id desc LIMIT 1', function (err, res) {
            var preLastMailID = JSON.stringify(res.last_mailID);

            var fetch = item.getFetch(imap, preLastMailID);

            fetch.on('message', function (msg, seqno) {
              item.onFetHandler(fetch, db, imap, msg, seqno);
            });

            fetch.once('error', item.errFetHandler);

            fetch.once('end', function () {
              item.endFetHandler(imap, db);
            });
          });
        });
    });
  });

  imap.once('error', function (err) {
    item.status = 1;
    console.log(err);
  });

  imap.once('end', function () {
    console.log('Connection ended');
  });

  imap.connect();
})();

