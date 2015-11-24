/**
 * Created by chensheng on 15/2/10.
 */
var sqlite3 = require('sqlite3').verbose()
  , config = require('./config')
  , fs = require('fs')
  , Promise = require('promise');

var init = {
  initDirectory: function () {
    //初始化目录数组
    var paths = [config.path.apk,config.path.ipa,config.path.attachments];
    //初始化目录
    for(var i = 0,len = paths.length; i < len; i++){
      if(!fs.existsSync(paths[i])){
        fs.mkdir(paths[i]);
      }
    }
  },

  initTable: function () {
    var db = new sqlite3.Database(config.db)
      , promise = Promise.resolve(db.serialize);

    promise
      .then(function () {
        // 建立邮件表
        db.run('CREATE TABLE mail(' +
        'id INTEGER PRIMARY KEY NOT NULL,' +
        'runid INTEGER,' +
        'status TINYINT,' +
        'subject TEXT);');
      })
      .then(function () {
        // 建立启动表
        db.run('CREATE TABLE mailpro(' +
        'id INTEGER PRIMARY KEY NOT NULL,' +
        'start_time DATE,' +
        'end_time DATE,' +
        'last_mailID INT,' +
        'status TINYINT);');
      })
      .then(function () {
        // 附件表
        db.run('CREATE TABLE attachment(' +
        'id INTEGER PRIMARY KEY NOT NULL,' +
        'code VARCHAR(32),' +
        'url VARCHAR(100));');
      });
  }
};

init.initDirectory();
init.initTable();

