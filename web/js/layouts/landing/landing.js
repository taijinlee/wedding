define([
  'jquery',
  'underscore',
  'backbone',
  './header/header',
  './footer/footer',
  'text!./landing.html'
], function($, _, Backbone, HeaderView, FooterView, landingTemplate) {

  var View = Backbone.View.extend({
    el: $('#container'),

    initialize: function(config, vent, pather, cookie) {
      this.header = new HeaderView(config, vent, pather, cookie);
      this.footer = new FooterView(config, vent, pather, cookie);
    },

    render: function(view) {
      this.$el.html(_.template(landingTemplate));
      this.header.setElement(this.$('#app-header')).render();
      this.$('#app-body').unbind();
      view.setElement(this.$('#app-body')).render();
    }

  });

  return View;

});
