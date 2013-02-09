define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.html('');
      return this;
    }

  });

  return View;

});
