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
      this.$el.empty();
    },

    renderNotification: function(message, alertType) {
      this.$el.append(_.template(notificationsTemplate, { message: message, alertType: alertType }));
    },

    closeNotification: function() {
      this.$el.empty();
      return false;
    }

  });

  return View;

});
