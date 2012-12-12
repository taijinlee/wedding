define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/auth',

    schema: {
      id: { type: 'string', optional: true },
      userId: { type: 'string', optional: true },
      type: { type: 'authType' },
      identifier: { type: 'string' },
      secret: { type: 'string' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
