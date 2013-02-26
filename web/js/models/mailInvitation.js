define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/mailInvitation',

    schema: {
      id: { type: 'string', optional: true },
      userId: { type: 'string' },
      partyId: { type: 'string' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
