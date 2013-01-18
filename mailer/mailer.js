
var nodeMailer = require('nodemailer');
var _ = require('underscore');

module.exports = function() {

  var config = require(process.env.APP_ROOT + '/config/config.js')();

  var send = function(from, emails, subject, body, callback) {
    if (process.env.NODE_ENV === 'dev') {
      emails = _.isArray(emails) ? emails : [ emails ];
      if (!process.env.USER) { return callback(new Error('server: No user set, email not sent')); }
      subject += ' [to: [' + emails.join(', ') + ']]';
      emails = _.map(emails, function (email) {
        console.log(email);
        return email.indexOf('apricotwhisk') === -1 ? process.env.USER + '@apricotwhisk.com' : email;
      });
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
