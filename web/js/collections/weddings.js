
define([
  './base',
  'models/wedding'
], function(BaseCollection, WeddingModel) {

  return BaseCollection.extend({
    url: '/api/weddings',
    model: WeddingModel
  });

});
