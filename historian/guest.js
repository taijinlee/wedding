
var async = require('async');

module.exports = function(store) {
  var GuestModel = require(process.env.APP_ROOT + '/models/guest.js')(store);

  var create = function(guestData, callback) {
    return new GuestModel(guestData).create(callback);
  };

  var update = function(guestId, guestData, callback) {
    return new GuestModel(guestData).update({ id: guestId }, callback);
  };

  var remove = function(id, callback) {
    return new GuestModel({ id: id }).remove(callback);
  };

  return {
    create: create,
    update: update,
    remove: remove
  };

};
