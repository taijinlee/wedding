
define([
  'backbone-web',
  'socket.io'
], function(BackboneWebModel, SocketIo) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/chat',

    schema: {
      id: { type: 'string', optional: true },
      weddingId: { type: 'string' },
      title: { type: 'string' },
      participants: {type: 'object' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    },

    sync : function(method, collection, options) {
      console.log('socket collection '+this.name+' sync called');
    }

  });

  return Model;

});
