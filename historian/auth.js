
var async = require('async');

module.exports = function(store) {
  var AuthModel = require(process.env.APP_ROOT + '/models/auth.js')(store);

  var create = function(authData, callback) {
    new AuthModel(authData).create(callback);
  };

  return {
    create: create
  };
};
