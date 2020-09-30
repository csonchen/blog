/**
 * Created by chensheng on 15/2/12.
 */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mail.db');
db.serialize(function(){
    //输出测试
    db.all('select * from mailpro', function (err, res) {
        if (!err) {
            console.log(JSON.stringify(res));
        } else {
            console.log(err);
        }
    });
    db.all('select * from mail', function (err, res) {
        if (!err) {
            console.log(JSON.stringify(res));
        } else {
            console.log(err);
        }
    });
});


