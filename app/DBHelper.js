/**
 * Created by chensheng on 15/12/2.
 */
var config = require('../config.json')
  , sqlite3 = require('sqlite3').verbose();

class DBHelper {
  static getSqliteDB() {
    return new sqlite3.Database(config.db);
  }
}

module.exports = DBHelper;
