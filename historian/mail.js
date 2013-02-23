
module.exports = function(store) {
  var async = require('async');

  var MailModel = require(process.env.APP_ROOT + '/models/mail.js')(store);
  var PartyModel = require(process.env.APP_ROOT + '/models/party.js')(store);
  var mailer = require(process.env.APP_ROOT + '/mailer/mailer.js')();

  var create = function(mailData, callback) {
    async.auto({
      sendMail: function(done) { mailer.send(mailData.from, mailData.to, mailData.subject, mailData.body, done); },
      logMail: ['sendMail', function(done) { new MailModel(mailData).create(callback); }]
    }, callback);
  };

  var createSaveTheDate = function(mailData, partyId, callback) {
    async.auto({
      sendMail: function(done) { mailer.send(mailData.from, mailData.to, mailData.subject, mailData.body, done); },
      logMail: ['sendMail', function(done) { new MailModel(mailData).create(done); }],
      updateParty: ['sendMail', function(done) { new PartyModel({ stdSentDate: new Date().getTime() }).update({id : partyId}, done); }]
    }, callback);
  };

  return {
    create: create,
    createSaveTheDate : createSaveTheDate
  };

};
