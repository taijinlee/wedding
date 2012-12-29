
module.exports = function(store) {
  var async = require('async');

  var MailModel = require(process.env.APP_ROOT + '/models/mail.js')(store);
  var mailer = require(process.env.APP_ROOT + '/mailer/mailer.js')();

  var create = function(mailData, callback) {
    async.auto({
      sendMail: function(done) { mailer.send(mailData.from, mailData.to, mailData.subject, mailData.body, done) },
      logMail: ['sendMail', function(done) { new MailModel(mailData).create(callback); }]
    }, callback);
  };

  return {
    create: create
  };

};
