define([
  'jquery',
  'underscore',
  'backbone',
  'text!./input.html'
], function($, _, Backbone, inputTemplate) {

  return Backbone.View.extend({

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.html(inputTemplate);
    }

  });

});
