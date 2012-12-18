
define([
  './base',
  'models/party'
], function(BaseCollection, PartyModel) {

  return BaseCollection.extend({
    url: '/api/party',
    model: PartyModel
  });

});
