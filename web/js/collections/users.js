
define([
  './base',
  'models/user'
], function(BaseCollection, UserModel) {

  return BaseCollection.extend({
    url: '/api/users',
    model: UserModel
  });

});
