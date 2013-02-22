
var https = require('https');
var url = require('url');
var config = require(process.env.APP_ROOT + '/config/config.js')();
var querystring = require('querystring');
var _ = require('underscore');

var Google = function(refreshToken, accessToken) {
  if (!accessToken) { accessToken = ''; }
  this.refreshToken = refreshToken;
  this.accessToken = accessToken;
};

module.exports = Google;

Google.prototype.accessTokenRequestOptions = {
  host: 'accounts.google.com',
  path: '/o/oauth2/token',
  port: 443,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'GData-Version': '3.0'
  }
};

Google.prototype.contactRequestOptions = {
  host: 'www.google.com',
  path: '/m8/feeds/contacts/default/full', // base, add query params when doing request
  port: 443,
  method: 'GET',
  headers: {
    'GData-Version': '3.0'
  }
};

Google.prototype.getAccessToken = function(callback) {
  var self = this;
  var request = https.request(this.accessTokenRequestOptions, function(response) {
    var data = '';
    response.on('data', function(chunk) {
      data += chunk.toString();
    });
    response.on('end', function() {
      self.accessToken = JSON.parse(data).access_token;
      return callback(null, self.accessToken);
    });
  });

  request.write('client_id=' + config.googleOAuth.clientId + '&');
  request.write('client_secret=' + config.googleOAuth.secret + '&');
  request.write('refresh_token=' + this.refreshToken + '&');
  request.write('grant_type=refresh_token');
  request.end();
};

Google.prototype.getContacts = function(callback) {
  var query = {
    alt: 'json',
    'max-results': 25,
    access_token: this.accessToken
  };

  this.contactQuery('/m8/feeds/contacts/default/thin?' + querystring.stringify(query), [], callback);
};

Google.prototype.contactQuery = function(path, contactsAcc, callback) {
  var reqOptions = _.clone(this.contactRequestOptions);
  reqOptions.path = path;

  var self = this;
  var request = https.request(reqOptions, function(response) {
    var data = '';
    response.on('data', function(chunk) {
      data += chunk.toString();
    });
    response.on('end', function() {
      var contacts = JSON.parse(data);
      var nextUrl = _.find(contacts.feed.link, function(link) {
        return link.rel === 'next';
      });
      nextUrl = nextUrl ? url.parse(nextUrl.href).path + '&access_token=' + self.accessToken : null;

      var parsedContacts = _.map(contacts.feed.entry, function(contactEntry) {
        var primaryEmail = _.find(contactEntry.gd$email, function(emailEntry) { return emailEntry.primary === 'true' }) || _.first(contactEntry.gd$email);
        return {
          name: contactEntry.title.$t,
          email: primaryEmail ? primaryEmail.address : '',
          address: contactEntry.gd$postalAddress ? contactEntry.gd$postalAddress.$t : ''
        };
      });

      contactsAcc = contactsAcc.concat(parsedContacts);
      if (nextUrl) {
        return self.contactQuery(nextUrl, contactsAcc, callback);
      }
      return callback(null, contactsAcc);
    });
  });
  request.end();

};




