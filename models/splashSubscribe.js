module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'backbone-web'
  ], function(BackboneServerModel) {

    ServerModel = BackboneServerModel.extend({
      store: store,
      context: { database: 'wedding', collection: 'splashSubscribe' },

      schema: {
        id: { type: 'string' },
        email: { type: 'email' },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
