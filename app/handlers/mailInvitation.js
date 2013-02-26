
var async = require('async');
var _ = require('underscore');
var fs = require('fs');
var config = require(process.env.APP_ROOT + '/config/config.js')();
var tokenizer = require(process.env.APP_ROOT + '/lib/tokenizer.js')();

module.exports = function(store, history) {

  var MailModel = require(process.env.APP_ROOT + '/models/mail.js')(store);
  var PartyModel = require(process.env.APP_ROOT + '/models/party.js')(store);

  var WeddingModel = require(process.env.APP_ROOT + '/models/wedding.js')(store);
  var WebMailModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'mail');

  var create = function(tokenUserId, partyId, callback) {
    async.auto({
      party: function(done) { new PartyModel({ id: partyId }).retrieve(done); },
      wedding: ['party', function(done, results) { new WeddingModel({ id: results.party.weddingId }).retrieve(done); }],
      template: function(done, result) { fs.readFile(process.env.APP_ROOT + '/mailer/templates/invitation.html', done); },
      rsvpUrl: ['party', function(done, results) {
        // TODO: don't reuse same token!
        var token = tokenizer.generate(partyId, 'addressVerification', 0, 0);
        var weddingToken = tokenizer.generate(results.party.weddingId, 'rsvpInvitation', 0, 0);
        return done(null, 'http://' + config.app.host + '/rsvpInv/' + encodeURIComponent(results.party.weddingId) + '/' + encodeURIComponent(weddingToken) + '/' + encodeURIComponent(partyId) + '/' + encodeURIComponent(token));
      }]
    }, function(error, results) {
      if (error) { return callback(error); }
      var template = results.template.toString();
      var weddingName = results.wedding.name.split('&');
      var subject = results.wedding.name; // TODO: Come up with a better subject
      var invText = results.wedding.invText;
      invText = invText.replace(/\r\n/g, "<br />");
      var body = _.template(template, { invText: invText, config: config, rsvpUrl: results.rsvpUrl, location: results.wedding.address, date: results.wedding.date, time: results.wedding.time, meals: results.wedding.meals });

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

      history.record(tokenUserId, 'mail', 'createInvitation', mailData.id, [mail.toJSON(), results.party.id], function(error, historyData) {
        if (error) { return callback(error); }
        return callback(null, new WebMailModel(mail.toJSON()).toJSON());
      });
    });
  };

  return {
    create: create
  };

};
