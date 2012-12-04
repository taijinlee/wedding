
module.exports = function(store, history) {
  var _ = require('underscore');
  var async = require('async');

  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);
  var WebUserModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'user');

  var assetManager = require(process.env.APP_ROOT + '/assetManager/assetManager.js')(store);
  var tokenizer = require(process.env.APP_ROOT + '/tokenizer/tokenizer.js')();

  /* Basic crud */
  var create = function(userData, callback) {
    userData.id = store.generateId();
    userData.salt = tokenizer.generateSalt();
    userData.password = tokenizer.generate(userData.salt, userData.password, 0, 0);
    var user = new UserModel(userData);
    console.log(userData);
    if (!user.isValid()) { return callback(new Error('invalid:invalid input')); } // TODO: make this clearer

    history.record(userData.id, 'user', 'create', userData.id, [user.toJSON()], function(error, historyData) {
      var webUser = new WebUserModel(user.toJSON()).toJSON();
      return callback(null, webUser);
    });
  };

  var retrieve = function(tokenUserId, userId, callback) {
    var isSelf = tokenUserId === userId;
    var user = new UserModel({ id: userId });
    if (!user.isExistingFieldsValid()) { return callback(new Error('invalid: user corrupt: id: ' + userId)); }

    async.auto({
      user: function(done) { user.retrieve(done); },
      userAvatar: ['user', function(done) {
        assetManager.getUrl(user.get('imageAssetId'), function(error, url) {
          if (error && error.message !== 'notFound') { return callback(error); }
          user.set('profilePictureUrl', (error) ? '' : url);
          return done(null);
        });
      }]
    }, function(error, results) {
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
    UserModel.prototype.list(filters, limit, pageId, function(error, drinks) {
      if (error) { return callback(error); }
      drinks = _.map(drinks, function(drink) { return new WebUserModel(drink).toJSON(); });
      return callback(null, drinks);
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
