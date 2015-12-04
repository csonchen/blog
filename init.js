/**
 * Created by chensheng on 15/2/10.
 */
var DB = require('./app/DBHelper').getSqliteDB()
  , config = require('./config.json')
  , fs = require('fs')
  , Promise = require('promise');

Promise.all([
  Promise.resolve(DB.serialize),
  Promise.resolve(DB.run)
])
  .then(function () {
    //初始化目录数组
    var paths = [config.path.apk,config.path.ipa,config.path.attachments];
    //初始化目录
    for(var i = 0,len = paths.length; i < len; i++){
      if(!fs.existsSync(paths[i])){
        fs.mkdir(paths[i]);
      }
    }
  })
  .then(function () {
    // 建立邮件表
    DB.run('CREATE TABLE mail(' +
    'id INTEGER PRIMARY KEY NOT NULL,' +
    'runid INTEGER,' +
    'status TINYINT,' +
    'subject TEXT);');
  })
  .then(function () {
    // 建立启动表
    DB.run('CREATE TABLE mailpro(' +
    'id INTEGER PRIMARY KEY NOT NULL,' +
    'start_time DATE,' +
    'end_time DATE,' +
    'last_mailID INT,' +
    'status TINYINT);');
  })
  .then(function () {
    // 附件表
    DB.run('CREATE TABLE attachment(' +
    'id INTEGER PRIMARY KEY NOT NULL,' +
    'code VARCHAR(32),' +
    'url VARCHAR(100));');
  })
  .then(function () {
    DB.serialize(function () {
      DB.run('INSERT INTO mailpro("last_mailID","status") VALUES(1,0)');
    });
  })
  .then(function () {
    DB.close();
  });