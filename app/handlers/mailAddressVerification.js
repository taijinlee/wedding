
var async = require('async');
var _ = require('underscore');
var config = require(process.env.APP_ROOT + '/config/config.js')();

module.exports = function(store, history) {

  var MailModel = require(process.env.APP_ROOT + '/models/mail.js')(store);
  var PartyModel = require(process.env.APP_ROOT + '/models/party.js')(store);

  var WeddingModel = require(process.env.APP_ROOT + '/models/wedding.js')(store);
  var WebMailModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'mail');
  var tokenizer = require(process.env.APP_ROOT + '/tokenizer/tokenizer.js')();

  var create = function(tokenUserId, partyId, callback) {
    async.auto({
      party: function(done) { new PartyModel({ partyId: partyId}).retrieve(done); },
      wedding: ['party', function(done, results) { new WeddingModel({ weddingId: results.weddingId }).retrieve(done); }],
      addressVerificationLink: function(done) {
        var ttl = 604800000;
        var time = new Date().getTime();
        var token = tokenizer.generate(partyId, 'addressVerification', time, ttl);
        return done(null, 'http://' + config.app.host + '/address/' + encodeURIComponent(partyId) + '/' + encodeURIComponent(token + '-' + time));
      }
    }, function(error, results) {
      if (error) { return callback(error); }
      var weddingName = results.wedding.name;

      subject = 'We need your address!';
      body = "We're planning our wedding and we need to verify your address! Please go here to help us out:<br /><br />" + results.addressVerificationLink + "<br /><br />" + weddingName;

      var mailData = {
        id: store.generateId(),
        userId: tokenUserId,
        to: _.pluck(results.party.guests, 'email'),
        from: 'Wedding Bot <weddingbot@apricotwhisk.com>',
        subject: subject,
        body: body
      };

      var mail = new MailModel(mailData);
      if (!mail.isValid()) { return callback(new Error('invalid:invalid input')); } // TODO: make this clearer

      history.record(tokenUserId, 'mail', 'create', mailData.id, [mail.toJSON()], function(error, historyData) {
        if (error) { return callback(error); }
        return callback(null, new WebMailModel(mail.toJSON()).toJSON());
      });
    });
  };

  return {
    create: create
  };

};
