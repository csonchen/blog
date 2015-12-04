/**
 * Created by chensheng on 15/12/2.
 */

'use strict';

var config = require('../config.json')
  , sqlite3 = require('sqlite3').verbose();

var DBHepler = {
  getSqliteDB: function () {
    return new sqlite3.Database(config.db);
  }
};

module.exports = DBHepler;
