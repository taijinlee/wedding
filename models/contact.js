module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'web/js/models/contact'
  ], function (WebModel) {

    ServerModel = WebModel.extend({
      store: store,
      context: { database: 'wedding', collection: 'contacts' },

      schema: {
        id: { type: 'string' },
        userId: { type: 'string' },
        name: { type: 'string' },
        avatarUrl: { typd: 'string', optional: true },
        email: { type: 'email', optional: true },
        address: { type: 'string', optional: true }
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
