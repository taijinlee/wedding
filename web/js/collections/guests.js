
define([
  './base',
  'models/guest'
], function(BaseCollection, GuestModel) {

  return BaseCollection.extend({
    url: '/api/guest',
    model: GuestModel
  });

});
