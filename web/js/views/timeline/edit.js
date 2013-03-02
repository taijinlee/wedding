define([
  'jquery',
  'underscore',
  'backbone',
  'text!./edit.html'

], function($, _, Backbone) {

  return Backbone.View.extend({

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;

    },

    render: function() {
      this.$el.html();
    },


  });


});
