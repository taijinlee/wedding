define([
  'jquery',
  'underscore',
  'backbone',
  './signup/signup',
  'text!./homepage.html',
  'text!./signupModal.html'
], function($, _, Backbone, SignupView, homepageTemplate, signupModalTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click #getStarted': 'popupSignupOverlay'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      if (this.cookie.get('userId')) {
        return Backbone.history.navigate(this.pather.getUrl('userGuestlist'), { trigger: true });
      }
      this.signupView = new SignupView(config, vent, pather, cookie);
      this.vent.on('homepage:signup:success', this.closeModal, this);
      this.$modal = $(signupModalTemplate);

    },

    render: function() {
      $('body').addClass('homepage-body');
      this.$el.html(_.template(homepageTemplate));
      return this;
    },

    popupSignupOverlay: function(event) {
      event.preventDefault(); event.stopPropagation();
      this.signupView.setElement(this.$modal.find('#modal-body')).render();
      this.$modal.modal('show');
    },

    closeModal: function(event) {
      this.$modal.modal('hide');
    }

  });

  return View;

});
