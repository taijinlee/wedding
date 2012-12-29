module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'web/js/models/mail'
  ], function (WebModel) {

    ServerModel = WebModel.extend({
      store: store,
      context: { database: 'wedding', collection: 'mails' },

      schema: {
        id: { type: 'string' },
        userId: { type: 'string' },
        to: { type: 'object' },
        from: { type: 'string', optional: true },
        subject: { type: 'string' },
        body: { type: 'string' },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
