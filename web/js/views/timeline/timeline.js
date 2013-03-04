define([
  'jquery',
  'underscore',
  'backbone',
  './input',
  './output',
  'text!./timelineLayout.html'
], function($, _, Backbone, TimelineInputView, TimelineOutputView, timelineLayout) {

  return Backbone.View.extend({

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.timelineInputView = new TimelineInputView(config, vent, pather, cookie, args);
      this.timelineOutputView = new TimelineOutputView(config, vent, pather, cookie, args);
    },

    render: function() {
      this.$el.html(timelineLayout);
      this.timelineInputView.setElement(this.$el.find('#timeline-input')).render();
      this.timelineOutputView.setElement(this.$el.find('#timeline-output')).render();
    }

  });

});
