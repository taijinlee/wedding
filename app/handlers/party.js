
module.exports = function(store, history) {
  var _ = require('underscore');
  var async = require('async');

  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);
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
    var party = new PartyModel({ id: partyId });
    party.retrieve(function(error, partyData) {
      if (error) { return callback(error); }
      return callback(null, partyData);
    });
  };

  var update = function(tokenUserId, partyId, updateData, callback) {
    var party = new PartyModel(_.extend({ id: partyId }, updateData), { parse: true });
    if (!party.isExistingFieldsValid()) { return callback(new Error('invalid: party corrupt: id: ' + partyId + ' data:' + JSON.stringify(updateData))); }

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

  var list = function(filters, limit, pageId, callback) {
    PartyModel.retrieve();
    PartyModel.prototype.list(filters, limit, pageId, function(error, partys) {
      if (error) { return callback(error); }
      partys = _.map(partys, function(party) { return new WebPartyModel(party).toJSON(); });
      return callback(null, partys);
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
