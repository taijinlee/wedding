define([
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'models/user',
  'collections/chats',
  'text!./chat.html',
  'text!./chatEntry.html'
], function($, _, Backbone, moment, UserModel, ChatsCollection, chatTemplate, chatEntryTemplate) {

  return Backbone.View.extend({

    events: {
      'submit form': 'sendChat'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.eventId = args[0];

      this.chats = new ChatsCollection();
      this.chats.on('reset', this.renderChats, this);
      this.chats.on('add', this.renderChats, this);

      this.user = new UserModel({ id: this.cookie.get('userId') });
    },

    render: function() {
      this.$el.html(_.template(chatTemplate, { backUrl: this.pather.getUrl('timeline') }));

      var self = this;
      this.user.fetch({
        success: function() {
          window.socket.emit('chat:retrieve', { eventId: this.eventId });
          window.socket.on('chat:retrieve', function(data) {
            self.chats.reset(data);
          });

          window.socket.on('chat:create', function(data) {
            if (data.eventId !== self.eventId) { return; }
            data.user = self.user.toJSON();
            self.chats.add(data);
          });

        }
      });

    },

    sendChat: function(event) {
      event.preventDefault(); event.stopPropagation();
      var values = {
        eventId: this.eventId,
        userId: this.cookie.get('userId')
      };
      _.each($(event.currentTarget).serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      window.socket.emit('chat:create', values);
    },

    renderChats: function() {
      var $chat = this.$('#chat');
      $chat.empty();

      var userId = this.cookie.get('userId');
      this.chats.each(function(chatModel) {
        var chatData = chatModel.toJSON();
        chatData.isSelf = (userId === chatData.userId);
        chatData.created = moment(chatData.created).fromNow();
        $chat.append(_.template(chatEntryTemplate, chatData));
      });

    }

  });

});
