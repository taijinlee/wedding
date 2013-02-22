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
        category: { type: 'string', defaults: 'none' },
        address: { type: 'string', optional: true },
        priority: { type: 'string', defaults: 'none' },
        addressVerified: { type: 'bool', defaults: false },
        stdSentDate: {type: 'timestamp', defaults: 0 },
        isAddressed: {type: 'bool', defaults: false },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
