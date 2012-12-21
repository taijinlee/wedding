module.exports = function(store, history) {
  var _ = require('underscore');
  var async = require('async');

  var AuthModel = require(process.env.APP_ROOT + '/models/auth.js')(store);
  var tokenizer = require(process.env.APP_ROOT + '/tokenizer/tokenizer.js')();

  /* Basic crud */
  var create = function(tokenUserId, type, identifier, secret, expires, shouldHashSecret, callback) {
    var authData = {
      id: tokenUserId + '|' + type,
      userId: tokenUserId,
      type: type,
      identifier: identifier,
      secret: secret
    };

    if (expires) { authData.expires = expires; }
    if (shouldHashSecret) {
      authData.salt = tokenizer.generateSalt();
      authData.secret = tokenizer.generate(authData.salt, secret, 0, 0);
    }

    var auth = new AuthModel(authData);
    var errors = auth.validate(authData);
    if (errors) { return callback(new Error('invalid:invalid input')); } // TODO: make this clearer

    history.record(tokenUserId, 'auth', 'create', authData.id, [auth.toJSON()], function(error, historyData) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var retrieve = function(tokenUserId, authId, callback) {
    new AuthModel({ id: authId }).retrieve(function(error, authData) {
      if (error) { return callback(error); }
      if (!authData) { return callback(null, {}); }
      if (tokenUserId !== authData.userId) { return callback(new Error('unauthorized')); }
      authData.identifier = '***scrubbed***';
      authData.secret = '***scrubbed***';
      delete authData.salt;
      return callback(null, authData);
    });
  };

  return {
    create: create,
    retrieve: retrieve
  };

};
