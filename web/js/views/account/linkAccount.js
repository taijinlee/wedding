define([
  'jquery',
  'underscore',
  'backbone',
  'models/auth',
  'text!./linkAccount.html',
  'text!./googleLink.html'
], function($, _, Backbone, AuthModel, linkAccountTemplate, googleLinkTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.googleAuth = new AuthModel({ id: this.cookie.get('userId') + '|' + 'google' });
    },

    render: function() {
      this.$el.html(_.template(linkAccountTemplate));
      var self = this;
      this.googleAuth.fetch({
        success: _.bind(this.renderGoogleAuth, this),
        error: _.bind(this.renderGoogleAuth, this)
      });
    },

    renderGoogleAuth: function(model) {
      var data = { googleOAuthUrl: '' };
      if (!model.get('identifier')) {
        data = { googleOAuthUrl: this.pather.getUrl('googleOAuth', { state: window.location.href }) };
      }
      this.$el.find('#googleLink').append(_.template(googleLinkTemplate, data));
    }

  });

  return View;

});
