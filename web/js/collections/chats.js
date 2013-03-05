
define([
  './base',
  'models/chat'
], function(BaseCollection, ChatModel) {

  return BaseCollection.extend({
    url: '/api/chats',
    model: ChatModel,

    comparator: function(chat) {
      return chat.get('created_at');
    }


  });

});
