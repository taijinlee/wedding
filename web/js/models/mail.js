
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/mail',

    schema: {
      id: { type: 'string' },
      userId: { type: 'string' },
      to: { type: 'object' },
      from: { type: 'string', optional: true },
      subject: { type: 'string' },
      body: { type: 'string' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
