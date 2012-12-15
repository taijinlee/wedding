
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/guest',

    schema: {
      id: { type: 'string', optional: true },
      weddingId: { type: 'string' },
      firstName: { type: 'string', optional: true },
      lastName: { type: 'string', optional: true },
      email: { type: 'email', optional: true },
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
