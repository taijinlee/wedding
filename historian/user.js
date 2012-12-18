
var async = require('async');

module.exports = function(store) {
  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);
  var AuthModel = require(process.env.APP_ROOT + '/models/auth.js')(store);
  var WeddingModel = require(process.env.APP_ROOT + '/models/wedding.js')(store);
  var PartyModel = require(process.env.APP_ROOT + '/models/party.js')(store);

  var create = function(userData, authData, callback) {
    async.auto({
      createUser: function(done) { new UserModel(userData).create(done); },
      createAuth: function(done) { new AuthModel(authData).create(done); }
    }, callback);
  };

  var update = function(userId, userData, callback) {
    return new UserModel(userData).update({ id: userId }, callback);
  };

  var remove = function(id, callback) {
    return new UserModel({ id: id }).remove(callback);
  };

  var signup = function(userData, authData, weddingData, partyData, callback) {
    async.auto({
      createUser: function(done) { new UserModel(userData).create(done); },
      createAuth: function(done) { new AuthModel(authData).create(done); },
      createWedding: function(done) { new WeddingModel(weddingData).create(done); },
      createParty: function(done) { new PartyModel(partyData).create(done); }
    }, callback);
  };

  return {
    create: create,
    update: update,
    remove: remove,
    signup: signup
  };

};
