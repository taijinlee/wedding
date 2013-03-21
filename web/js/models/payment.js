
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/payment',

    schema: {
      id: { type: 'string' },
      userId: { type: 'string' },
      paymentAmount: { type: 'string' },
      paymentToken: { type: 'string' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
