define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;

      var self = this;
      $.ajax({
        url: '/api/auth/logout',
        success: function() {
          Backbone.history.navigate('', { trigger: true });
        },
        error: function() {
          Backbone.history.navigate('', { trigger: true });
        }
      });
    }
  });

  return View;

});
