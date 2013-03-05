
define([
  './base',
  'models/chat'
], function(BaseCollection, ChatModel) {

  return BaseCollection.extend({
    url: '/api/chats',
    model: ChatModel,

    comparator: function(chatA, chatB) {
      return (chatA.get('created') > chatB.get('created') ? -1 : 1);
    }


  });

});
