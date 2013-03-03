
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/event',

    schema: {
      id: { type: 'string', optional: true },
      name: { type: 'string' },
      time: { type: 'timestamp' },
      people: { type: 'object', optional: true },
      location: { type: 'string', optional: true },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
