
define([
  './base',
  'models/event'
], function(BaseCollection, EventModel) {

  return BaseCollection.extend({
    url: '/api/events',
    model: EventModel,

    comparator: function(event) {
      return event.get('time');
    }


  });

});
