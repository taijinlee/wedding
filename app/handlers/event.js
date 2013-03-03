
module.exports = function(store, history) {
  var _ = require('underscore');

  var EventModel = require(process.env.APP_ROOT + '/models/event.js')(store);
  var WebEventModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'event');

  /* Basic crud */
  var create = function(tokenUserId, name, time, people, location, callback) {
    var eventData = {
      id: store.generateId(),
      name: name,
      time: time,
      people: people,
      location: location
    };
    var event = new EventModel(eventData);

    history.record(tokenUserId, 'event', 'create', eventData.id, [event.toJSON()], function(error, historyData) {
      if (error) { return callback(error); }
      return callback(null, new WebPartyModel(event.toJSON()).toJSON());
    });
  };

  var retrieve = function(tokenUserId, eventId, callback) {
    new PartyModel({ id: eventId }).retrieve(function(error, partyData) {
      if (error) { return callback(error); }
      return callback(null, new WebPartyModel(partyData).toJSON());
    });
  };

  var update = function(tokenUserId, eventId, updateData, callback) {
    var event = new EventModel(_.extend({ id: eventId }, updateData), { parse: true });
    if (!event.isExistingFieldsValid()) { return callback(new Error('invalid: event corrupt: id: ' + eventId + ' data:' + JSON.stringify(updateData))); }

    history.record(tokenUserId, 'event', 'update', eventId, [eventId, updateData], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var destroy = function(tokenUserId, eventId, callback) {
    history.record(tokenUserId, 'event', 'remove', eventId, [eventId], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var list = function(tokenUserId, filters, limit, pageId, callback) {
    EventModel.prototype.list(filters, limit, pageId, function(error, events) {
      if (error) { return callback(error); }
      return callback(null, _.map(events, function(event) { return new WebEventModel(event).toJSON(); }));
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
