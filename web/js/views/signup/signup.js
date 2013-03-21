define([
  'jquery',
  'underscore',
  'backbone',
  'models/signup',
  'models/authBase',
  'text!./form.html'
], function($, _, Backbone, SignupModel, AuthBaseModel, formTemplate) {

  var SignupView = Backbone.View.extend({
    events: {
      'submit': 'signup'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.html(_.template(formTemplate));
      return this;
    },

    signup: function(event) {
      event.preventDefault(); event.stopPropagation();
      var values = {};

      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });
      console.log("FUCK");
     console.log(values);
      Stripe.setPublishableKey('pk_test_3Li4dEQmrdYdyJZvc51J63Lr');
/*
      var amount = $('#cc-amount').val(); // amount you want to charge in cents
      Stripe.createToken({
        number: $('.card-number').val(),
        cvc: $('.card-cvc').val(),
        exp_month: $('.card-expiry-month').val(),
        exp_year: $('.card-expiry-year').val()
      }, amount, stripeResponseHandler);
*/
      var self = this;
      new SignupModel().save(values, {
        error: function(model, response) {
          self.$el.find('.help-inline').remove();
          self.$el.find('.control-group').removeClass('error');
          var errors = model.validate(values);
          _.each(errors, function(errorInfo) {
            var $input = self.$el.find('#' + errorInfo.column);
            $input.closest('.control-group').addClass('error');
            $input.after(self.make('span', { 'class': 'help-inline' }, 'Required' ));
          });
        },
        success: function(model, response) {
          // auto login
          new AuthBaseModel().save({ type: 'base', identifier: values.email, secret: values.secret }, {
            success: function() {
              Backbone.history.navigate(self.pather.getUrl('userGuestlist'), true);
            },
            error: function() {
              self.vent.trigger('renderNotification', 'You have successfully registered! Please login', 'success');
            }
          });
        }
      });
      return false;
    }


  });

  return SignupView;

});
