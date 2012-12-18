define([
  'jquery',
  'underscore',
  'backbone',
  'pather',
  'models/cookie',
  'views/app/app'
], function($, _, Backbone, Pather, CookieModel, AppView) {
  var Router = Backbone.Router.extend({

    paths: [
      { urlFragment: '', view: 'homepage', symName: 'homepage' },
      { urlFragment: 'login', view: 'login/login', symName: 'login' },
      { urlFragment: 'logout', view: 'logout/logout', symName: 'logout' },
      { urlFragment: 'signup', view: 'signup/signup', symName: 'signup' },
      { urlFragment: 'wedding/:id', view: 'weddings/show', symName: 'weddingShow' },
      { urlFragment: 'wedding', view: 'weddings/show', symName: 'weddingShow' },
      { urlFragment: 'weddings', view: 'weddings/list', symName: 'weddingsList' },
      { urlFragment: 'weddings/new', view: 'weddings/new', symName: 'weddingsNew' },
      { urlFragment: 'guest/new/:weddingId', view: 'guest/new', symName: 'guestNew' },
      { urlFragment: 'account', view: 'account/account', symName: 'account', requireLogin: true }
    ],

    initialize: function(config) {
      this.config = config;
      this.vent = _.extend({}, Backbone.Events);
      this.pather = new Pather(this.paths);
      this.cookie = new CookieModel();

      this.app = new AppView(this.config, this.vent, this.pather, this.cookie);

      // going backwards for backbone compatability
      this.route('*splat', 'default', function() { // TODO: route this to 404 instead
        return Backbone.history.navigate('', { trigger: true });
      });

      var self = this;
      _.each(this.paths.reverse(), function(path) {
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
        $(window).unbind('scroll'); // need this for now because of infinite scroll
        self.vent.unbind();
        // self.AppView.bindNotifications();
        self.app.render(new View(self.config, self.vent, self.pather, self.cookie, args));
      });
    }

  });

  return Router;

});
