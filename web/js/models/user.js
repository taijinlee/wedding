
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/user',

    schema: {
      id: { type: 'string', optional: true },
      name: { type: 'string' },
      email: { type: 'email', optional: true },
      secret: { type: 'string', optional: true },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
