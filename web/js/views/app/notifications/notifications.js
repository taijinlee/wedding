define([
  'jquery',
  'underscore',
  'backbone',
  'text!./notifications.html'
], function($, _, Backbone, notificationsTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click a.alert_close': 'closeNotification'
    },

    initialize: function(config, vent, pather, cookie) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.vent.on('renderNotification', this.renderNotification, this);
    },

    renderNotification: function(messages, alertType) {
      if (!_.isArray(messages)) { messages = [messages]; }
      this.$el.append(_.template(notificationsTemplate, { messages: messages, alertType: alertType }));
    },

    closeNotification: function() {
      this.$el.empty();
      return false;
    }

  });

  return View;

});
