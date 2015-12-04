/**
 * Created by chensheng on 15/11/23.
 */
var item = require('./app/item')
  , Promise = require('promise')
  , account = require('./config.json').imap
  , Imap = require('imap')
  , DB = require('./app/DB')
  , moment = require('moment')
  , DBHelper = require('./app/DBHelper');

var imap = new Imap(account)
  , DBSqlite = DBHelper.getSqliteDB()
  , promise = Promise.resolve(DBSqlite.serialize);

imap.once('ready', function () {
  // 程序启动时间
  var startTime = moment().format('YYYY-MM-DD HH:mm:ss');
  item.setStartTime(startTime);

  imap.openBox('INBOX', true, function (err) {
    if (err) {
      item.setStatus(1);
    }

    promise
      .then(function () {
        DBSqlite.get('SELECT * FROM mailpro ORDER BY id DESC LIMIT 1', function (err, res) {
          var preLastMailID = JSON.stringify(res.last_mailID);

          //var fetch = imap.seq.fetch("" + preLastMailID + ":*", {
          //  bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
          //  struct: true
          //});

          var fetch = imap.seq.fetch("843:*", {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            struct: true
          });

          fetch.on('message', function (msg, seqno) {
            item.onFetHandler(fetch, imap, msg, seqno);
          });

          fetch.once('error', item.errFetHandler);

          fetch.once('end', function () {
            item.endFetHandler(imap);
          });
        });
        DBSqlite.close();
      });
  });
});

imap.once('error', function () {
  item.setStatus(1);
});

imap.once('end', function () {
  console.log('Connection ended');
});

imap.connect();

