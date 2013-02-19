define([
  'text!./routes.json',
  'jquery',
  'underscore',
  'backbone',
  'pather',
  'models/cookie',
  'views/app/app'
], function(routes, $, _, Backbone, Pather, CookieModel, AppView) {
  var Router = Backbone.Router.extend({

    paths: function() {
      var parsedRoutes = JSON.parse(routes).routes;

      // add external routes
      return parsedRoutes.concat([
        { urlFragment: 'https://accounts.google.com/o/oauth2/auth?response_type=code&scope=' +
          encodeURIComponent(this.config.googleOAuth.contactScope) +
          '&redirect_uri=' + encodeURIComponent(this.config.googleOAuth.redirectUri) +
          '&client_id=' + encodeURIComponent(this.config.googleOAuth.clientId) +
          '&access_type=offline&state=:state', view: '!external', symName: 'googleOAuth' },
        { urlFragment: 'http://www.facebook.com/dialog/oauth/?' +
          encodeURIComponent(this.config.facebookOAuth.contactScope) +
          '&redirect_uri=' + encodeURIComponent(this.config.facebookOAuth.redirectUri) +
          '&client_id=' + encodeURIComponent(this.config.facebookOAuth.clientId) +
          '&state=:state', view: '!external', symName: 'facebookOAuth' }]);
    },

    initialize: function(config) {
      this.config = config;
      this.vent = _.extend({}, Backbone.Events);
      this.pather = new Pather(this.paths());
      this.cookie = new CookieModel();

      this.app = new AppView(this.config, this.vent, this.pather, this.cookie);

      // going backwards for backbone compatability
      this.route('*splat', 'default', function() { // TODO: route this to 404 instead
        return Backbone.history.navigate('', { trigger: true });
      });

      var self = this;
      _.each(this.paths().reverse(), function(path) {
        // ignore any empty views or views with ! in the view name
        if (!path.view || path.view.indexOf('!') !== -1) { return; }

        self.route(path.urlFragment, path.view, (function(_view, requireLogin) {
          return function() {
            var regex = (document.cookie.search(';') === -1) ? /c=(.*)/ : /c=(.*?);/;
            var cookieJSON = document.cookie ? $.parseJSON(decodeURIComponent(regex.exec(document.cookie)[1])) : {};
            self.cookie.clear({ silent: true });
            self.cookie.set(cookieJSON, { silent: true });

            // boot back to homepage if we require a login, and we don't have one
            if (requireLogin && (!self.cookie || !self.cookie.get('userId'))) {
              return Backbone.history.navigate('', { trigger: true });
            }

            var args = Array().slice.call(arguments);
            args.unshift(_view);
            return self.genericRoute.apply(self, args);
          };
        }(path.view, path.requireLogin)));
      });

      Backbone.history.start({ pushState: true });
    },

    genericRoute: function() {
      var args = Array().slice.call(arguments);
      var view = args.shift();
      var self = this;

      require([
        'views/' + view
      ], function(View) {
        self.vent.unbind();
        self.app.render(new View(self.config, self.vent, self.pather, self.cookie, args));
      });
    }

  });

  return Router;

});
