
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/party/address',

    schema: {
      id: { type: 'string', optional: true },
      address: { type: 'string', optional: true },
      accessToken: { type: 'string', optional: true },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
