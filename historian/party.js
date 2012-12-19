
var async = require('async');

module.exports = function(store) {
  var PartyModel = require(process.env.APP_ROOT + '/models/party.js')(store);

  var create = function(partyData, callback) {
    return new PartyModel(partyData).create(callback);
  };

  var update = function(partyId, partyData, callback) {
    return new PartyModel(partyData).update({ id: partyId }, callback);
  };

  var remove = function(id, callback) {
    return new PartyModel({ id: id }).remove(callback);
  };

  return {
    create: create,
    update: update,
    remove: remove
  };

};
