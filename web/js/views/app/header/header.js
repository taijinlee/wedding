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
        { symName: 'homepage', name: 'Home' },
        { symName: 'login', name: 'Login', loggedIn: false },
        { symName: 'signup', name: 'Signup', loggedIn: false },
        { symName: 'organization', name: 'Organization', loggedIn: true },
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
