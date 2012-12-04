
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/user',

    schema: {
      id: { type: 'string', optional: true },
      name: { type: 'string', optional: true },
      email: { type: 'email', optional: true },
      title: { type: 'string', optional: true },
      phone: { type: 'phoneNum', optional: true },
      directReport: { type: 'string', optional: true },
      department: { type: 'string', optional: true },
      objective: { type: 'string', optional: true },
      keyResults: { type: 'object', optional: true },
      password: { type: 'string', optional: true },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
