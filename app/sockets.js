
var _ = require('underscore');
var async = require('async');

module.exports = function(store, history, io) {

  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);
  var ChatModel = require(process.env.APP_ROOT + '/models/chat.js')(store);
  var WebChatModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'chat');

  io.sockets.on('connection', function(socket) {

    socket.on('chat:retrieve', function(filters, callback) {
      var limit = null;
      var pageId = 0;
      ChatModel.prototype.list(filters, limit, pageId, function(error, chats) {
        if (error) { return socket.emit('chat:retrieve:error', error); }
        async.map(chats, chatMetaData, function(error, chats) {
          return callback(_.map(chats, function(chat) { return new WebChatModel(chat).toJSON(); }));
        });
      });
    });

    socket.on('chat:create', function(chatData) {
      chatData.id = store.generateId();
      new ChatModel(chatData).create(function(error, chatData) {
        chatMetaData(chatData, function(error, chatData) {
          socket.broadcast.emit('chat:create', chatData);
          socket.emit('chat:create', chatData);
        });
      });
    });
  });


  var chatMetaData = function(chatData, callback) {
    new UserModel({ id: chatData.userId }).retrieve(function(error, userData) {
      if (error) { return callback(error); }
      chatData.user = userData;
      return callback(null, chatData);
    });
  };

};
