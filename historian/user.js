
module.exports = function(store) {
  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);

  var create = function(userData, callback) {
    return new UserModel(userData).create(callback);
  };

  var update = function(userId, userData, callback) {
    return new UserModel(userData).update({ id: userId }, callback);
  };

  var remove = function(id, callback) {
    return new UserModel({ id: id }).remove(callback);
  };

  return {
    create: create,
    update: update,
    remove: remove
  };

};
