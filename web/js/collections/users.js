
define([
  './base',
  'models/user'
], function(BaseCollection, UserModel) {

  return BaseCollection.extend({
    url: '/api/user',
    model: UserModel
  });

});
