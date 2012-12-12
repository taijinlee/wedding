module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'web/js/models/user'
  ], function (WebModel) {

    ServerModel = WebModel.extend({
      store: store,
      context: { database: 'wedding', collection: 'auth' },
      key: { primary: 'id' },

      schema: {
        id: { type: 'string' },
        userId: { type: 'string' },
        type: { type: 'string' },
        identifier: { type: 'string' },
        secret: { type: 'string' },
        salt: { type: 'string', optional: true },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
