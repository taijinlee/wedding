
var nodeMailer = require('nodemailer');
var _ = require('underscore');

module.exports = function() {

  var config = require(process.env.APP_ROOT + '/config/config.js')();

  var send = function(from, emails, subject, body, callback) {
    if (process.env.NODE_ENV === 'dev') {
      if (!process.env.USER) { return callback(new Error('server: No user set, email not sent')); }
      subject += ' [to: [' + (_.isArray(emails) ? emails.join(', ') : emails) + ']]';
      emails = process.env.USER + '@apricotwhisk.com';
    }

    var transport = nodeMailer.createTransport('SMTP', {
      service: config.smtp.service,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password
      }
    });

    transport.sendMail({
      from: from,
      to: emails,
      subject: subject,
      html: body,
      generateTextFromHTML: true
    }, function(error, responseStatus) {
      if (error) { return callback(error); }
      // console.log(responseStatus.message);
      return callback(null);
    });
  };

  return {
    send: send
  };

};
