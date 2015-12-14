/**
 * Created by chensheng on 15/12/2.
 */

var md5 = require('MD5');

class Util {
  static splitMailAdr(mailAdr) {
    var _ = /[\w\.]+@[\w\.]+/g;
    return mailAdr.match(_);
  }

  static encrypt(filename) {
    return md5(filename);
  }
}

module.exports = Util;
