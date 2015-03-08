/**
 * Created by chensheng on 15/2/10.
 */
var sqlite3 = require('sqlite3').verbose(),
    config = require('./config'),
    fs = require('fs');
var db = new sqlite3.Database(config.db);
db.serialize(function(){
    //建立启动表
    db.run('CREATE TABLE mailpro(' +
    'id INTEGER PRIMARY KEY NOT NULL,' +
    'start_time DATE,' +
    'end_time DATE,' +
    'last_mailID INT,' +
    'status TINYINT);');
    db.run('INSERT INTO mailpro("last_mailID","status") VALUES(1,0)');
    //建立邮件表
    db.run('CREATE TABLE mail(' +
    'id INTEGER PRIMARY KEY NOT NULL,' +
    'runid INTEGER,' +
    'status TINYINT,' +
    'subject TEXT);');
});

(function(){
    var i = 0;
    //初始化目录数组
    var paths = [config.path.apk,config.path.ipa,config.path.attachments];
    //初始化目录
    for(var i = 0,len = paths.length; i < len; i++){
        if(!fs.existsSync(paths[i])){
            fs.mkdir(paths[i]);
        }
    }
})();

