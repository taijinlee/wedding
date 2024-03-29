module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'web/js/models/user'
  ], function (WebModel) {

    ServerModel = WebModel.extend({
      store: store,
      context: { database: 'wedding', collection: 'users' },

      schema: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'email', optional: true },
        role: { type: 'userRole', defaults: 'user' },
        // active: { type: 'boolean', defaults: false }, // flesh this out later
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
