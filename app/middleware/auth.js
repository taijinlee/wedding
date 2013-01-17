
module.exports = function(store, cookieJar) {

  var async = require('async');
  var AuthModel = require(process.env.APP_ROOT + '/models/auth.js')(store);
  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);
  var salt = 'Plubrl#mla!2lUCleFluSTouW@i@SWoA';
  var tokenizer = require(process.env.APP_ROOT + '/lib/tokenizer.js')();

  // called globally before all routing
  var getTokenUserId = function(req, res, next) {
    res.locals.auth = { tokenUserId: false };

    var loginToken = cookieJar.get('login');
    if (!loginToken) { return next(null); }

    var userId = loginToken.slice(0, loginToken.indexOf(':'));
    var tokenParts = loginToken.split(':');
    tokenParts.unshift(salt);

    if (tokenizer.match.apply(null, tokenParts)) { res.locals.auth.tokenUserId = userId; }
    return next(null);
  };

  var isRole = function(role) {
    return function(req, res, next) {
      async.series([
        async.apply(requireLogin, req, res),
        function(done) {
          var user = new UserModel({ id: res.locals.auth.tokenUserId });
          user.retrieve(function(error, userData) {
            if (error) { return next(error); }
            if (userData.role !== role) { return next(new Error('unauthorized')); }
            return done(null);
          });
        }
      ], function(error) {
        next(error);
      });
    };
  };

  // requires getTokenUserId to run before it
  var requireLogin = function(req, res, next) {
    if (res.locals.auth.tokenUserId === false) { return next(new Error('unauthorized: require login')); }
    return next(null);
  };

  // requires getTokenUserId to run before it
  var requireLogout = function(req, res, next) {
    if (res.locals.auth.tokenUserId !== false) { return next(new Error('unauthorized: require logout')); }
    return next(null);
  };

  var login = function(req, res, next) {
    async.auto({
      authData: function(done, results) {
        new AuthModel({ identifier: req.body.identifier, type: 'base' }).retrieve(done);
      },
      authenticate: ['authData', function(done, results) {
        var authData = results.authData;
        if (!authData || !tokenizer.match(authData.salt, req.body.secret, 0, 0, authData.secret)) {
          return done(new Error('unauthorized: incorrect password'));
        }

        var userId = authData.userId;
        // give the user a good login cookie
        var time = (new Date()).getTime();
        var token = tokenizer.generate(salt, userId, time, 300000 /* 5 mins */);

        cookieJar.set('userId', userId);
        cookieJar.set('login', [userId, time, 300000, token].join(':'));
        res.cookie.apply(res, cookieJar.cookie());
        return done(null);
      }]
    }, next);
  };

  var logout = function(req, res, next) {
    cookieJar.del('userId');
    cookieJar.del('login');
    res.cookie.apply(res, cookieJar.cookie());
    return next();
  };


  return {
    getTokenUserId: getTokenUserId,
    isRole: isRole,
    requireLogin: requireLogin,
    requireLogout: requireLogout,
    login: login,
    logout: logout
  };
};
