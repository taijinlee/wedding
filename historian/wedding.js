
var async = require('async');

module.exports = function(store) {
  var WeddingModel = require(process.env.APP_ROOT + '/models/wedding.js')(store);
  var GuestModel = require(process.env.APP_ROOT + '/models/guest.js')(store);

  var create = function(weddingData, fianceData, callback) {
    async.auto({
      fiance: function(done) { new GuestModel(fianceData).create(done); },
      wedding: function(done) { new WeddingModel(weddingData).create(done); }
    }, callback);
  };

  var update = function(weddingId, weddingData, callback) {
    return new WeddingModel(weddingData).update({ id: weddingId }, callback);
  };

  var remove = function(id, callback) {
    return new WeddingModel({ id: id }).remove(callback);
  };

  return {
    create: create,
    update: update,
    remove: remove
  };

};
