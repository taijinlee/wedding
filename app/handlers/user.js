
module.exports = function(store, history) {
  var _ = require('underscore');
  var async = require('async');

  var AuthModel = require(process.env.APP_ROOT + '/models/auth.js')(store);
  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);
  var WebUserModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'user');

  var assetManager = require(process.env.APP_ROOT + '/assetManager/assetManager.js')(store);
  var tokenizer = require(process.env.APP_ROOT + '/tokenizer/tokenizer.js')();

  /* Basic crud */
  var create = function(email, firstName, lastName, secret, callback) {
    var userData = {
      id: store.generateId(),
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: 'user'
    };

    var authData = {
      id: store.generateId(),
      userId: userData.id,
      type: 'base',
      identifier: email
    };
    authData.salt = tokenizer.generateSalt();
    authData.secret = tokenizer.generate(authData.salt, secret, 0, 0);

    var user = new UserModel(userData);
    if (!user.isValid()) { return callback(new Error('invalid:invalid input')); } // TODO: make this clearer

    var auth = new AuthModel(authData);
    if (!auth.isValid()) { return callback(new Error('invalid:invalid input')); } // TODO: make this clearer

    history.record(userData.id, 'user', 'create', userData.id, [user.toJSON(), auth.toJSON()], function(error, historyData) {
      if (error) { return callback(error); }
      return callback(null, new WebUserModel(user.toJSON()).toJSON());
    });
  };

  var retrieve = function(tokenUserId, userId, callback) {
    var isSelf = tokenUserId === userId;
    var user = new UserModel({ id: userId });
    if (!user.isExistingFieldsValid()) { return callback(new Error('invalid: user corrupt: id: ' + userId)); }

    getMetadata(user, function(error, user) {
      if (error) { return callback(error); }
      return callback(null, new WebUserModel(user.toJSON()).toJSON());
    });
  };

  var update = function(tokenUserId, userId, updateData, callback) {
    var user = new UserModel(_.extend({ id: userId }, updateData), { parse: true });
    if (!user.isExistingFieldsValid()) { return callback(new Error('invalid: user corrupt: id: ' + userId + ' data:' + JSON.stringify(updateData))); }

    history.record(tokenUserId, 'user', 'update', userId, [userId, updateData], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var destroy = function(tokenUserId, userId, callback) {
    history.record(tokenUserId, 'user', 'remove', userId, [userId], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var list = function(filters, limit, pageId, callback) {
    UserModel.prototype.list(filters, limit, pageId, function(error, users) {
      if (error) { return callback(error); }
      async.map(users, getMetaData, function(error, users) {
        if (error) { return callback(error); }
        return callback(null, _.map(users, function(uwer) { return new WebUserModel(user).toJSON(); }));
      });
    });
  };

  var getMetaData = function(user, callback) {
    async.auto({
      userAvatar: function(done) {
        assetManager.getUrl(user.get('imageAssetId'), function(error, url) {
          if (error && error.message !== 'notFound') { return callback(error); }
          user.set('profilePictureUrl', (error) ? '' : url);
          return done(null);
        });
      }
    }, callback);
  };

  return {
    create: create,
    retrieve: retrieve,
    update: update,
    destroy: destroy,
    list: list
  };

};
