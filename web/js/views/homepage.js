define([
  'jquery',
  'underscore',
  'backbone',
  'text!views/homepage/homepage.html'
], function($, _, Backbone, homepageTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      return this;
    }

  });

  return View;

});
