
module.exports = function(store, history) {
  var _ = require('underscore');
  var async = require('async');

  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);
  var GuestModel = require(process.env.APP_ROOT + '/models/guest.js')(store);
  var WebGuestModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'guest');

  /* Basic crud */
  var create = function(tokenUserId, weddingId, guestData, callback) {
    guestData.id = store.generateId();
    var guest = new GuestModel(guest);

    history.record(tokenUserId, 'guest', 'create', guestData.id, [guestData], function(error, historyData) {
      if (error) { return callback(error); }
      return callback(null, new WebGuestModel(guest.toJSON()).toJSON());
    });
  };

  var retrieve = function(tokenUserId, guestId, callback) {
    var guest = new GuestModel({ id: guestId });
    guest.retrieve(function(error, guestData) {
      if (error) { return callback(error); }
      return callback(null, guestData);
    });
  };

  var update = function(tokenUserId, guestId, updateData, callback) {
    var guest = new GuestModel(_.extend({ id: guestId }, updateData), { parse: true });
    if (!guest.isExistingFieldsValid()) { return callback(new Error('invalid: guest corrupt: id: ' + guestId + ' data:' + JSON.stringify(updateData))); }

    history.record(tokenUserId, 'guest', 'update', guestId, [guestId, updateData], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var destroy = function(tokenUserId, guestId, callback) {
    history.record(tokenUserId, 'guest', 'remove', guestId, [guestId], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var list = function(filters, limit, pageId, callback) {
    GuestModel.prototype.list(filters, limit, pageId, function(error, drinks) {
      if (error) { return callback(error); }
      drinks = _.map(drinks, function(drink) { return new WebGuestModel(drink).toJSON(); });
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
