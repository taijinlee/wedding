module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'web/js/models/user'
  ], function (WebModel) {

    ServerModel = WebModel.extend({
      store: store,
      context: { database: 'orgChart', collection: 'users' },
      key: { primary: 'id' },

      schema: {
        id: { type: 'string' },
        name: { type: 'string', optional: true },
        department: { type: 'string', optional: true },
        email: { type: 'email', optional: true },
        password: { type: 'string', optional: true },
        role: { type: 'userRole', defaults: 'user' },
        salt: { type: 'string', optional: true },

        title: { type: 'string', optional: true },
        phone: { type: 'string', optional: true },
        directReport: { type: 'string', optional: true },
        objective: { type: 'string', optional: true },
        keyResults: { type: 'object', optional: true },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
