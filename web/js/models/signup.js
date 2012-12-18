
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/user/signup',

    schema: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      fianceFirstName: { type: 'string' },
      fianceLastName: { type: 'string' },
      email: { type: 'email' },
      secret: { type: 'string' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
