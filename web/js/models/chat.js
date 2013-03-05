
define([
  'backbone-web',
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/chat',

    schema: {
      id: { type: 'string', optional: true },
      userId: { type: 'string' },
      user: { type: 'object', optional: true },
      eventId: { type: 'string' },
      message: { type: 'string' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
