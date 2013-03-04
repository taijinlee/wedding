
define([
  'backbone-web',
  'socket.io'
], function(BackboneWebModel, SocketIo) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/chatmessage',

    schema: {
      id: { type: 'string', optional: true },
      chatId: { type: 'string' },
      originatorId: { type: 'string' },
      message: { type: 'string' },
      participants: {type: 'object' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }
    
    sync : function(method, collection, options) {
      console.log('socket collection '+this.name+' sync called');
    }

  });

  return Model;

});
