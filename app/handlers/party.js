
module.exports = function(store, history) {
  var _ = require('underscore');
  var async = require('async');

  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);
  var WeddingModel = require(process.env.APP_ROOT + '/models/wedding.js')(store);

  var PartyModel = require(process.env.APP_ROOT + '/models/party.js')(store);
  var WebPartyModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'party');

  /* Basic crud */
  var create = function(tokenUserId, weddingId, partyData, callback) {
    partyData.id = store.generateId();
    var party = new PartyModel(party);

    history.record(tokenUserId, 'party', 'create', partyData.id, [partyData], function(error, historyData) {
      if (error) { return callback(error); }
      return callback(null, new WebPartyModel(party.toJSON()).toJSON());
    });
  };

  var retrieve = function(tokenUserId, partyId, callback) {
    async.auto({
      party: function(done) {
        new PartyModel({ id: partyId }).retrieve(done);
      },
      wedding: ['party', function(done, results) {
        new WeddingModel({ id: results.party.weddingId }).retrieve(done);
      }],
    }, function(error, results) {
      if (error) { return callback(error); }
      return callback(null, new WebPartyModel(results.party).toJSON());
    });
  };

  var update = function(tokenUserId, partyId, updateData, callback) {
    var party = new PartyModel(_.extend({ id: partyId }, updateData), { parse: true });
    if (!party.isExistingFieldsValid()) { return callback(new Error('invalid: party corrupt: id: ' + partyId + ' data:' + JSON.stringify(updateData))); }

    if (!tokenUserId) { tokenUserId = 'guest'; } // replace this with the email that was used to respond at some point

    history.record(tokenUserId, 'party', 'update', partyId, [partyId, updateData], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var destroy = function(tokenUserId, partyId, callback) {
    history.record(tokenUserId, 'party', 'remove', partyId, [partyId], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var list = function(tokenUserId, filters, limit, pageId, callback) {
    async.auto({
      partys: function(done) {
        PartyModel.prototype.list(filters, limit, pageId, done);
      },
      weddings: ['partys', function(done, results) {
        var weddingIds = _.chain(results.partys).pluck('weddingId').unique().value();
        async.map(weddingIds, function(weddingId, mapDone) {
          new WeddingModel({ id: weddingId }).retrieve(mapDone);
        }, function(error, weddings) {
          if (error) { return done(error); }
          return done(null, _.object(_.pluck(weddings, 'id'), weddings));
        });
      }]
    }, function(error, results) {
      if (error) { return callback(error); }
      results.partys = _.filter(results.partys, function(party) {
        if (results.weddings[party.weddingId].userId !== tokenUserId) { return false; }
        return true;
      });
      return callback(null, _.map(results.partys, function(party) { return new WebPartyModel(party).toJSON(); }));
    });
  };

  return {
    create: create,
    retrieve: retrieve,
    update: update,
    destroy: destroy,
    list: list
  };

};
