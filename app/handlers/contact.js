
module.exports = function(store, history) {
  var _ = require('underscore');
  var async = require('async');

  var ContactModel = require(process.env.APP_ROOT + '/models/contact.js')(store);
  var WebContactModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'contact');

  var list = function(filters, limit, pageId, callback) {
    ContactModel.prototype.list(filters, limit, pageId, function(error, contacts) {
      if (error) { return callback(error); }
      contacts = _.map(contacts, function(contact) { return new WebContactModel(contact).toJSON(); });
      console.log(contacts);
      return callback(null, contacts);
    });
  };

  return {
    list: list
  };

};
