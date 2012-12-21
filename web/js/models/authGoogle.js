define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/auth/google/oauth2callback',

    schema: {
      id: { type: 'string', optional: true },
      userId: { type: 'string', optional: true },
      type: { type: 'authType', defaults: 'base' },
      identifier: { type: 'email' },
      secret: { type: 'string' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
