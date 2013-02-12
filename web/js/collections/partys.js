
define([
  './base',
  'models/party'
], function(BaseCollection, PartyModel) {

  return BaseCollection.extend({
    url: '/api/partys',
    model: PartyModel
  });

});
