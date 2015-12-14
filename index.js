/**
 * Created by chensheng on 15/11/23.
 */
var Item = require('./app/Item')
  , account = require('./config.json').imap
  , Imap = require('imap')
  , DB = require('./app/MailService');

var imap = new Imap(account)
  , item = new Item(imap);

imap.connect();
