define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/horizontalLinks/horizontalLinks',
  './login/login',
  'text!./header.html',
  'text!./loginModal.html'
], function($, _, Backbone, HorizontalLinksView, LoginView, headerTemplate, loginModalTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click #login': 'showLogin'
    },

    initialize: function(config, vent, pather, cookie) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.loginView = new LoginView(config, vent, pather, cookie);
      this.vent.on('homepage:signup:success', this.closeModal, this);
      this.$modal = $(loginModalTemplate);
    },

    render: function(options) {
      this.$el.html(_.template(headerTemplate)).addClass('container');
      return this;
    },

    showLogin: function(event) {
      event.preventDefault(); event.stopPropagation();
      this.loginView.setElement(this.$modal.find('#modal-body')).render();
      this.$modal.modal('show');
    },

    closeModal: function(event) {
      this.$modal.modal('hide');
    }

  });

  return View;

});
