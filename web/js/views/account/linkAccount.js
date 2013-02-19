define([
  'jquery',
  'underscore',
  'backbone',
  'models/auth',
  'text!./linkAccount.html',
  'text!./googleLink.html',
  'text!./facebookLink.html'
], function($, _, Backbone, AuthModel, linkAccountTemplate, googleLinkTemplate, facebookLinkTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.googleAuth = new AuthModel({ id: this.cookie.get('userId') + '|' + 'google' });
      this.facebookAuth = new AuthModel({ id: this.cookie.get('userId') + '|' + 'facebook' });
    },

    render: function() {
      this.$el.html(_.template(linkAccountTemplate));
      var self = this;
      this.googleAuth.fetch({
        success: _.bind(this.renderGoogleAuth, this),
        error: _.bind(this.renderGoogleAuth, this)
      });
      this.facebookAuth.fetch({
        success: _.bind(this.renderFacebookAuth, this),
        error: _.bind(this.renderFacebookAuth, this)
      });
    },

    renderGoogleAuth: function(model) {
      var data = { googleOAuthUrl: '' };
      if (!model.get('identifier')) {
        data = { googleOAuthUrl: this.pather.getUrl('googleOAuth', { state: window.location.href }) };
      }
      this.$el.find('#googleLink').append(_.template(googleLinkTemplate, data));
    },

    renderFacebookAuth: function(model) {
      var data = { facebookOAuthUrl: '' };
      if (!model.get('identifier')) {
        data = { facebookOAuthUrl: this.pather.getUrl('facebookOAuth', { state: window.location.href }) };
      }
      this.$el.find('#facebookLink').append(_.template(facebookLinkTemplate, data));
    }

  });

  return View;

});
