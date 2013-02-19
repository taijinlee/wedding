define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/horizontalLinks/horizontalLinks',
  'text!./header.html'
], function($, _, Backbone, HorizontalLinksView, headerTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.routes = [
        { symName: 'userGuestlist', name: 'My Guest List', loggedIn: true },
        { symName: 'login', name: 'Login', loggedIn: false },
        { symName: 'signup', name: 'Signup', loggedIn: false },
        { symName: 'linkAccount', name: 'Link social accounts', loggedIn: true },
        { symName: 'logout', name: 'Sign out', loggedIn: true, id: 'logout' }
      ];

      this.navigation = new HorizontalLinksView(config, vent, pather, cookie);
    },

    render: function(options) {
      this.$el.html(_.template(headerTemplate));

      this.navigation.setElement(this.$('#app-header-navigation')).render(this.routes);
      return this;
    }
  });

  return View;

});
