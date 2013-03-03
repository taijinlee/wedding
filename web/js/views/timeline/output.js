define([
  'jquery',
  'underscore',
  'backbone',
  'text!./output.html'
], function($, _, Backbone, outputTemplate) {

  return Backbone.View.extend({

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.html(outputTemplate);
    }

  });

});
