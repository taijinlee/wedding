
module.exports = function(app, middlewares, handlers) {

  var querystring = require('querystring');
  var https = require('https');
  var config = require(process.env.APP_ROOT + '/config/config.js')();

  /**
   * Using email and password, logs in an existing user
   */
  app.post('/api/auth', middlewares.auth.requireLogout, middlewares.auth.login, function(req, res, next) {
    return res.locals.responder.send();
  });

  /**
   * Logs an existing user out from the system and invalid their credential cookie.
   */
  app.get('/api/auth/logout', middlewares.auth.requireLogin, middlewares.auth.logout, function(req, res, next) {
    return res.locals.responder.send();
  });


  app.get('/api/auth/:authId', middlewares.auth.requireLogin, function(req, res, next) {
    var authId = req.params.authId;
    if (res.locals.auth.tokenUserId !== authId.slice(0, authId.indexOf('|'))) { return res.locals.responder.send(new Error('unauthorized: can only query for current user authtokens')); }
    handlers.auth.retrieve(res.locals.auth.tokenUserId, authId, res.locals.responder.send);
  });

  app.get('/api/auth/google/oauth2callback', middlewares.auth.requireLogin, function(req, res, next) {
    var code = req.query.code;
    var redirectUri = req.query.state;
    if (!code) { return next(new Error('no code for google')); }
    if (!redirectUri) { return next(new Error('no state for google')); }

    var postData = querystring.stringify({
      code: code,
      client_id: config.googleOAuth.clientId,
      client_secret: config.googleOAuth.secret,
      redirect_uri: 'http://localhost:4000/api/auth/google/oauth2callback',
      grant_type: 'authorization_code'
    });

    var request = https.request({
      host: 'accounts.google.com',
      port: 443,
      method: 'post',
      path: '/o/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }, function(response) {
      var data = '';
      response.on('data', function(chunk) {
        data += chunk;
      });
      response.on('end', function() {
        data = JSON.parse(data);
        var expires = (data.expires_in - 10) * 1000 + new Date().getTime();
        handlers.auth.create(res.locals.auth.tokenUserId, 'google', data.refresh_token, data.access_token, expires, false, function(error) {
          // if error do something!
          res.redirect(redirectUri);
        });
      });
    }).end(postData);
  });

  app.get('/api/auth/facebook/oauthcallback', middlewares.auth.requireLogin, function(req, res, next) {
    var code = req.query.code;
    var redirectUri = req.query.state;
    if (!code) { return next(new Error('no code for facebook')); }
    if (!redirectUri) { return next(new Error('no state for facebook')); }

    var queryString = querystring.stringify({
      code: code,
      client_id: config.facebookOAuth.clientId,
      client_secret: config.facebookOAuth.secret,
      redirect_uri: 'http://localhost:4000/api/auth/facebook/oauthcallback'
    });

    var request = https.request({
      host: 'graph.facebook.com',
      port: 443,
      method: 'get',
      path: '/oauth/access_token?' + queryString,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }, function(response) {
      var data = '';
      response.on('data', function(chunk) {
        data += chunk;
      });
      response.on('end', function() {
        data = querystring.parse(data);
        var expires = (data.expires - 10) * 1000 + new Date().getTime();
        handlers.auth.create(res.locals.auth.tokenUserId, 'facebook', data.access_token, data.access_token, expires, false, function(error) {
          // if error do something!
          res.redirect(redirectUri);
        });
      });
    }).end();

  });

};
