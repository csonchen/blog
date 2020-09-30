/**
 * Created by chensheng on 15/2/9.
 */
var log4js = require('log4js');

function getLogger(name){
    var logger = log4js.getLogger(name);
    logger.setLevel('auto');
    log4js.configure({
        appenders : [
            {type:'console'},
            {
                type:'dateFile',
                filename:'./log/logfile',
                pattern:'_yyyy-MM-dd.log',
                maxLogSize:1024,
                alwaysIncludePattern:true,
                backups:4,
                category:name
            }
        ],
        replaceConsole:true
    });
    return logger;
}

exports.logger = getLogger;