module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'web/js/models/wedding'
  ], function (WebModel) {

    ServerModel = WebModel.extend({
      store: store,
      context: { database: 'wedding', collection: 'weddings' },

      schema: {
        id: { type: 'string' },
        userId: { type: 'string' },
        name: { type: 'string' },
        mainPartyId: { type: 'string' },
        date: { type: 'string', optional: true },
        time: { type: 'string', optional: true },
        address: { type: 'string', optional: true },
        meals: { type: 'object', optional: true },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
