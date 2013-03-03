
var async = require('async');

module.exports = function(store) {
  var EventModel = require(process.env.APP_ROOT + '/models/event.js')(store);

  var create = function(eventData, callback) {
    return new EventModel(eventData).create(callback);
  };

  var update = function(eventId, eventData, callback) {
    return new EventModel(eventData).update({ id: eventId }, callback);
  };

  var remove = function(id, callback) {
    return new EventModel({ id: id }).remove(callback);
  };

  return {
    create: create,
    update: update,
    remove: remove
  };

};
