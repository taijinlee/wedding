
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
      category: { type: 'string', defaults: 'none' },
      addressVerified: { type: 'bool', defaults: false },
      stdSentDate: {type: 'timestamp', defaults: 0 },
      isAddressed: { type: 'bool', defaults: false },
      accessToken: { type: 'string', optional: true }, /* remove later */
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
