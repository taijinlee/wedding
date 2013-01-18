define([
  'jquery',
  'underscore',
  'backbone',
  'pather',
  'models/cookie',
  'views/app/app'
], function($, _, Backbone, Pather, CookieModel, AppView) {
  var Router = Backbone.Router.extend({

    paths: function() {
      return [
        { urlFragment: '', view: 'homepage', symName: 'homepage' },
        { urlFragment: 'login', view: 'login/login', symName: 'login' },
        { urlFragment: 'logout', view: 'logout/logout', symName: 'logout', requireLogin: true },
        { urlFragment: 'signup', view: 'signup/signup', symName: 'signup' },

        { urlFragment: 'guestlist/:weddingId', view: 'guestlist/show', symName: 'guestlist', requireLogin: true },
        { urlFragment: 'weddings', view: 'weddings/list', symName: 'weddingsList', requireLogin: true },
        { urlFragment: 'weddings/new', view: 'weddings/new', symName: 'weddingsNew', requireLogin: true },
        { urlFragment: 'wedding/:weddingId/settings', view: 'weddings/settings', symName: 'weddingSettings', requireLogin: true },
        { urlFragment: 'wedding/:weddingId/party/new', view: 'party/new', symName: 'partyNew', requireLogin: true },
        { urlFragment: 'wedding/:weddingId/party/:partyId', view: 'party/new', symName: 'partyEdit', requireLogin: true },
        { urlFragment: 'account', view: 'account/linkAccount', symName: 'linkAccount', requireLogin: true },

        { urlFragment: 'address/:partyId/:accessToken', view: 'party/verifyAddress', symName: 'verifyAddress' }, // public view for verifying your address
        { urlFragment: 'rsvpStd/:partyId/:accessToken', view: 'party/rsvpStd', symName: 'rsvpStd' }, // public view for RSVP'ing

        { urlFragment: 'https://accounts.google.com/o/oauth2/auth?response_type=code&scope=' +
          encodeURIComponent(this.config.googleOAuth.contactScope) +
          '&redirect_uri=' + encodeURIComponent(this.config.googleOAuth.redirectUri) +
          '&client_id=' + encodeURIComponent(this.config.googleOAuth.clientId) +
          '&access_type=offline&state=:state', view: '!external', symName: 'googleOAuth' }
      ];
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
