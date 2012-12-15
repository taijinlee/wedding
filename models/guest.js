module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'web/js/models/guest'
  ], function (WebModel) {

    ServerModel = WebModel.extend({
      store: store,
      context: { database: 'wedding', collection: 'guests' },

      schema: {
        id: { type: 'string' },
        weddingId: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'email', optional: true },
        address1: { type: 'string', optional: true },
        address2: { type: 'string', optional: true },
        city: { type: 'string', optional: true },
        state: { type: 'string', optional: true },
        zip: { type: 'string', optional: true },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
