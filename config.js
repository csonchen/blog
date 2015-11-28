/**
 * Created by chensheng on 15/2/9.
 */
module.exports = {
    path : {
        apk : './apk',
        ipa : './ipa',
        attachments : './attachments'
    },
    imap : {
        user: 'sheng.chen@dianjoy.com',
        password: 'zj292096aa',
        host: 'imap.qq.com',
        port: 993,
        tls: true
    },
    nodemailer : {
        service : 'qq',
        auth : {
            user : 'sheng.chen@dianjoy.com',
            pass: 'zj292096'
        }
    },
    mailOptions:{
        from : 'sheng.chen@dianjoy.com',
        subject : 'hello',
        text : 'hello world',
        html : '<b>hello world.</b>'
    },
    db : 'mail.db'
};