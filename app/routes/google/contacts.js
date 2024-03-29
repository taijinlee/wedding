
module.exports = function(app, middlewares, handlers) {

  var config = require(process.env.APP_ROOT + '/config/config.js')();
  var querystring = require('querystring');
  var https = require('https');

  var buildPath = function(params) {
    params = params || {};
    params.type = params.type || 'contacts';
    params.alt = params.alt || 'json';
    params.projection = params.projection || 'thin';
    params.email = params.email || 'default';
    params['max-results'] = params['max-results'] || 2000;

    var query = {
      alt: params.alt,
      'max-results': params['max-results']
    };

    var path = '/m8/feeds/';
    path += params.type + '/';
    path += params.email + '/';
    path += params.projection;
    path += '?' + querystring.stringify(query);
    return path;
  };


  app.get('/api/google/contacts', middlewares.auth.requireLogin, function(req, res, next) {

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
        res.end(data);
        console.log(data);
      });
    });

    var post_data = querystring.stringify({
      code: '4/HbBnk1KdWcHJqrS16IqHPkfBZZcF.IqxKmYgiNocdaDn_6y0ZQNj-eutzdwI',
      client_id: config.googleOAuth.clientId,
      client_secret: config.googleOAuth.secret,
      redirect_uri: config.googleOAuth.redirect_uri,
      grant_type: 'authorization_code'
    });
    request.write(post_data);

    console.log(request);

    request.end();
/*
    req.write("");
    req.write("&");
    req.write("");
    req.write("");
    req.end();
*/

  });

  app.get('/api/google/contacts/test', function(req, res, next) {
    console.log(req.query);
    console.log(req.body);
  });

};
