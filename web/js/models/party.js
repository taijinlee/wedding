
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/party',

    schema: {
      id: { type: 'string', optional: true },
      weddingId: { type: 'string' },
      guests: { type: 'object' },
      address: { type: 'string', optional: true },
      priority: { type: 'string', optional: true },
      category: { type: 'string', optional: true },
      addressVerified: { type: 'bool', defaults: false },
      accessToken: { type: 'string', optional: true }, /* remove later */
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
