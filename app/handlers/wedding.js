
module.exports = function(store, history) {
  var _ = require('underscore');
  var async = require('async');

  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);
  var GuestModel = require(process.env.APP_ROOT + '/models/guest.js')(store);
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
    var wedding = new WeddingModel({ id: weddingId });
    async.auto({
      wedding: function(done) { wedding.retrieve(done); },
      checkUser: ['wedding', function(done, results) {
        if (tokenUserId !== wedding.userId) {
          return done(new Error('unauthorized: userId:' + tokenUserId + ' not allowed'));
        }
      }],
      user: ['checkUser', function(done, results) {
        new UserModel({ id: wedding.get('userId') }).retrieve(done);
      }],
      fiance: ['checkUser', function(done, results) {
        new GuestModel({ id: wedding.get('fianceGuestId') }).retrieve(done);
      }]
    }, function(error, results) {
      if (error) { return callback(error); }
      wedding.set({ user: results.user.toJSON(), fiance: results.fiance.toJSON() });
      return callback(null, new WebWeddingModel(results.wedding).toJSON());
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
    WeddingModel.prototype.list(filters, limit, pageId, function(error, weddings) {
      if (error) { return callback(error); }
      weddings = _.map(weddings, function(wedding) { return new WebWeddingModel(wedding).toJSON(); });
      return callback(null, weddings);
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
