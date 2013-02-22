
var GoogleContacts = require(process.env.APP_ROOT + '/lib/oauth/google.js');
var async = require('async');
var _ = require('underscore');

module.exports = function(store) {
  var AuthModel = require(process.env.APP_ROOT + '/models/auth.js')(store);
  var ContactModel = require(process.env.APP_ROOT + '/models/contact.js')(store);

  var create = function(authData, callback) {
    new AuthModel(authData).create(callback);
    if (authData.type === 'google') { fetchGoogleContacts(authData); }
  };

  var fetchGoogleContacts = function(authData) {
    var gContacts = new GoogleContacts(authData.identifier);
    gContacts.getContacts(function(error, contacts) {
      if (error) { return console.log(error); }
      _.each(contacts, function(contact, index) {
        setTimeout(function() {
          contact.id = store.generateId();
          contact.userId = authData.userId;
          contact.keywords = _.unique(contact.name.toLowerCase().split(' '));
          new ContactModel(contact).create(function() {
            if (error) { return console.log(error); }
          });
        }, index * 1000);
      });
    });
  };

  return {
    create: create
  };
};
