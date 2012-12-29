
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/mailAddressVerification',

    schema: {
      id: { type: 'string' },
      userId: { type: 'string' },
      partyId: { type: 'string' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
