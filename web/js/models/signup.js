
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/user/signup',

    schema: {
      name: { type: 'string' },
      fianceName: { type: 'string' },
      email: { type: 'email' },
      secret: { type: 'string' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
