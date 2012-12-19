define([
  'jquery',
  'underscore',
  'backbone',
  'text!./linkAccount.html'

], function($, _, Backbone, linkAccountTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.html(_.template(linkAccountTemplate, { googleOAuthUrl: this.pather.getUrl('googleOAuth') }));
    }

  });

  return View;

});
