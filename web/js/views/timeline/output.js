define([
  'jquery',
  'underscore',
  'backbone',
  'collections/events',
  'text!./output.html'
], function($, _, Backbone, EventsCollection, outputTemplate) {

  return Backbone.View.extend({

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.timelineEvents = new EventsCollection();
      this.timelineEvents.on('add', this.renderEvents, this);

      this.vent.on('timelineInput:addEvent', addEvent);
    },

    render: function() {
      this.$el.html(outputTemplate);
    },

    renderEvents: function() {

    }

  });

});
