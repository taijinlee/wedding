
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/party',

    schema: {
      id: { type: 'string', optional: true },
      weddingId: { type: 'string' },
      guests: { type: 'object' },
      address1: { type: 'string', optional: true },
      address2: { type: 'string', optional: true },
      city: { type: 'string', optional: true },
      state: { type: 'string', optional: true },
      zip: { type: 'string', optional: true },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
