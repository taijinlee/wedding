
module.exports = function(store, history) {
  var _ = require('underscore');
  var async = require('async');

  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);
  var WeddingModel = require(process.env.APP_ROOT + '/models/wedding.js')(store);
  var WebWeddingModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'wedding');

  var create = function(tokenUserId, fianceFirstName, fianceLastName, callback) {
    var fianceGuestId = store.generateId();
    var weddingData = {
      id: store.generateId(),
      userId: tokenUserId,
      fianceGuestId: fianceGuestId
    };

    var fianceGuestData = {
      id: fianceGuestId,
      weddingId: weddingData.id,
      firstName: fianceFirstName,
      lastName: fianceLastName
    };

    var guest = new GuestModel(fianceGuestData);
    if (!guest.isValid()) { return callback(new Error('invalid:invalid input')); }

    var wedding = new WeddingModel(weddingData);
    if (!wedding.isValid()) { return callback(new Error('invalid:invalid input')); }

    history.record(tokenUserId, 'wedding', 'create', weddingData.id, [wedding.toJSON(), guest.toJSON()], function(error, historyData) {
      if (error) { return callback(error); }
      return callback(null, new WebWeddingModel(wedding.toJSON()).toJSON());
    });
  };

  var retrieve = function(tokenUserId, weddingId, callback) {
    async.auto({
      wedding: function(done) { new WeddingModel({ id: weddingId }).retrieve(done); },
      checkUser: ['wedding', function(done, results) {
        if (tokenUserId !== results.wedding.userId) {
          return done(new Error('unauthorized: userId:' + tokenUserId + ' not allowed'));
        }
        return done(null);
      }],
      metadata: ['wedding', function(done, results) { getMetadata(results.wedding, done); }]
    }, function(error, results) {
      if (error) { return callback(error); }
      return callback(null, new WebWeddingModel(results.metadata).toJSON());
    });
  };

  var update = function(tokenUserId, weddingId, updateData, callback) {
    var wedding = new WeddingModel(_.extend({ id: weddingId }, updateData), { parse: true });
    if (!wedding.isExistingFieldsValid()) { return callback(new Error('invalid: wedding corrupt: id: ' + weddingId + ' data:' + JSON.stringify(updateData))); }

    history.record(tokenUserId, 'wedding', 'update', weddingId, [weddingId, updateData], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var destroy = function(tokenUserId, weddingId, callback) {
    history.record(tokenUserId, 'wedding', 'remove', weddingId, [weddingId], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var list = function(filters, limit, pageId, callback) {
    async.auto({
      weddings: function(done) { WeddingModel.prototype.list(filters, limit, pageId, done); },
      metadata: ['weddings', function(done, results) {
        async.map(results.weddings, getMetadata, function(error, weddings) {
          if (error) { return done(error); }
          weddings = _.map(weddings, function(wedding) { return new WebWeddingModel(wedding).toJSON(); });
          return done(null, weddings);
        });
      }]
    }, function(error, results) {
      if (error) { return callback(error); }
      return callback(null, results.metadata);
    });
  };

  var getMetadata = function(wedding, callback) {
    async.auto({
      user: function(done, results) { new UserModel({ id: wedding.userId }).retrieve(done); }
    }, function(error, results) {
      if (error) { return callback(error); }
      return callback(null, _.extend(wedding, results));
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
