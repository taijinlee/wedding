
module.exports = function(app, middlewares, handlers) {

  var querystring = require('querystring');
  var https = require('https');

  /**
   * Using email and password, logs in an existing user
   */
  app.post('/api/auth', middlewares.auth.requireLogout, middlewares.auth.login, function(req, res, next) {
    return req.responder.send();
  });

  /**
   * TODO: should this be its own method or should this doc be rolled up
   * to the above mapping?
   * Using OAuth, logs in an existing user into the system
   */
  app.post('/api/auth/login', null /* TODO: figure this out */);


  app.get('/api/auth/:authId', middlewares.auth.requireLogin, function(req, res, next) {
    var authId = req.params.authId;
    if (req.auth.tokenUserId !== authId.slice(0, authId.indexOf('|'))) { return req.responder.send(new Error('unauthorized: can only query for current user authtokens')); }
    handlers.auth.retrieve(req.auth.tokenUserId, authId, req.responder.send);
  });

  app.get('/api/auth/google/oauth2callback', middlewares.auth.requireLogin, function(req, res, next) {
    var code = req.query.code;
    var redirectUri = req.query.state;
    if (!code) { return next(new Error('no code for google')); }
    if (!redirectUri) { return next(new Error('no state for google')); }

    var postData = querystring.stringify({
      code: code,
      client_id: '669677576804-oiqgaqu5qao3606jlqpjij2vln6l4sh5.apps.googleusercontent.com',
      client_secret: 'vQbQB798l2q08UmhwfJADzW-',
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
        handlers.auth.create(req.auth.tokenUserId, 'google', data.refresh_token, data.access_token, expires, false, function(error) {
          // if error do something!
          res.redirect(redirectUri);
        });
      });
    }).end(postData);

  });

  /**
   * Logs an existing user out from the system and invalid their credential cookie.
   */
  app.get('/api/auth/logout', middlewares.auth.requireLogin, middlewares.auth.logout, function(req, res, next) {
    return req.responder.send();
  });

};
