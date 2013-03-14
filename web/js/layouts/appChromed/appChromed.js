define([
  'jquery',
  'underscore',
  'backbone',
  './header/header',
  './notifications/notifications',
  './footer/footer',
  'text!./app.html'
], function($, _, Backbone, HeaderView, NotificationsView, FooterView, appTemplate) {

  var View = Backbone.View.extend({
    el: $('#container'),

    initialize: function(config, vent, pather, cookie) {
      this.vent = vent;

      this.header = new HeaderView(config, vent, pather, cookie);
      this.notifications = new NotificationsView(config, vent, pather, cookie);
      this.footer = new FooterView(config, vent, pather, cookie);
    },

    render: function(view) {
      this.$el.html(_.template(appTemplate));
      this.header.setElement(this.$('#app-header')).render();
      this.notifications.setElement(this.$('#app-notifications')).render();
      this.$('#app-body').unbind();
      view.setElement(this.$('#app-body')).render();
      // Maybe add this back in the future...
      // this.footer.setElement(this.$('#app-footer')).render();
      return this;
    },

    bindNotifications: function() {
      this.notifications.bind();
    }

  });

  return View;

});
