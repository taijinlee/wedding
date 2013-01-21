define([
  'jquery',
  'underscore',
  'backbone',
  'text!./stat.html'
], function($, _, Backbone, statTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
    },

    /**
     * stats in format
     * [ {display: display, value: value }, ... ] from top downwards
     * empty object -> horizontal rule
     */
    render: function(stats, title) {
      this.$el.html(_.template(statTemplate, { stats: stats, title: title }));
      return this;
    }
  });

  return View;

});
