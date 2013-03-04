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

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.timelineEvents = new EventsCollection();
      this.timelineEvents.on('reset', this.renderEvents, this);
      this.timelineEvents.on('add', this.renderEvents, this);

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
      this.timelineEvents.each(function(event) {
        var eventJSON = event.toJSON();
        eventJSON.time = moment.unix(eventJSON.time / 1000).format('h:mm a');
        $timelineList.append(_.template(outputEventTemplate, eventJSON));
      });
    }

  });

});
