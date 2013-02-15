
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/wedding',

    schema: {
      id: { type: 'string', optional: true },
      user: { type: 'object' },
      name: { type: 'string' },
      date: { type: 'string', optional: true },
      time: { type: 'string', optional: true },
      address: { type: 'string', optional: true },
      meals: { type: 'object', optional: true },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
