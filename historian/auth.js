
var async = require('async');

module.exports = function(store) {
  var AuthModel = require(process.env.APP_ROOT + '/models/auth.js')(store);
  var ContactModel = require(process.env.APP_ROOT + '/models/contact.js')(store);

  var create = function(authData, callback) {
    new AuthModel(authData).create(callback);
    if (authData.type === 'google') { fetchGoogleContacts(authData); }
  };

  var fetchGoogleContacts = function(authData) {
    params.keywords = _.unique([].concat(params.company.split(' '), params.name.split(' ')));
  };

  return {
    create: create
  };
};
