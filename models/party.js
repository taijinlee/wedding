module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'web/js/models/party'
  ], function (WebModel) {

    ServerModel = WebModel.extend({
      store: store,
      context: { database: 'wedding', collection: 'partys' },

      schema: {
        id: { type: 'string' },
        weddingId: { type: 'string' },
        guests: { type: 'object' },
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
