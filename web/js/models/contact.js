define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/contact',

    schema: {
      id: { type: 'string' },
      userId: { type: 'string' },
      name: { type: 'string' },
      avatarUrl: { typd: 'string', optional: true },
      email: { type: 'email', optional: true },
      address: { type: 'string', optional: true },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
