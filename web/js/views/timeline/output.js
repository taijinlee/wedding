define([
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'collections/events',
  'text!./output.html',
  'text!./outputEvent.html'
], function($, _, Backbone, moment, EventsCollection, outputTemplate, outputEventTemplate) {

  return Backbone.View.extend({

    events: {
      'click .timeline-close': 'deleteEvent'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.timelineEvents = new EventsCollection();
      this.timelineEvents.on('reset', this.renderEvents, this);
      this.timelineEvents.on('add', this.renderEvents, this);
      this.timelineEvents.on('remove', this.renderEvents, this);


      this.vent.on('timelineInput:addEvent', this.addEvent, this);
    },

    render: function() {
      this.$el.html(outputTemplate);
      this.timelineEvents.fetch();
    },

    addEvent: function(event) {
      this.timelineEvents.add(event);
    },

    renderEvents: function() {
      var $timelineList = this.$('#timelineList');
      $timelineList.empty();
      var self = this;
      this.timelineEvents.each(function(event) {
        var eventJSON = event.toJSON();
        eventJSON.time = moment.unix(eventJSON.time / 1000).format('h:mm a');
        var $event = $(_.template(outputEventTemplate, { event: eventJSON, pather: self.pather}))

        $event.find('.timeline-time').editable({
          type: 'text',
          url: function(data) {
            var d = new $.Deferred();
            event.save({ time: new Date(new Date().toDateString() + ' ' + data.value).getTime()}, {
              success: function() { return d.resolve(); },
              error: function() { return d.reject('error!'); }
            });
          }
        });
        $timelineList.append($event);
      });
    },

    deleteEvent: function(event) {
      event.preventDefault(); event.stopPropagation();

      var $eventClose = $(event.currentTarget);
      var eventId = $eventClose.data('event-id');
      var event = this.timelineEvents.get(eventId);
      event.destroy();
    }

  });

});
