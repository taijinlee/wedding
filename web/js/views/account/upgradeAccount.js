define([
  'jquery',
  'underscore',
  'backbone',
  'models/payment',
  'text!./upgradeAccount.html',
], function($, _, Backbone, PaymentModel, upgradeAccountTemplate) {

  var View = Backbone.View.extend({
    events: {
      'submit': 'upgrade'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.html(_.template(upgradeAccountTemplate));
    },
    
    upgrade: function(event) {
      event.preventDefault(); event.stopPropagation();
      
      var values = {};
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });
      var self = this;
      Stripe.setPublishableKey('pk_test_3Li4dEQmrdYdyJZvc51J63Lr');
      
      Stripe.createToken({
        number: values['card-number'],
        cvc: values['card-cvc'],
        exp_month: values['card-expiry-month'],
        exp_year: values['card-expiry-year']
      }, function(status, response) {
        if (status == '200' || status == 200) {
          new PaymentModel().save({
            userId: self.cookie.userId,
            paymentAmount: '2000',
            paymentToken: response.id
          }, {
            success: function() {
              console.log("Payment Saved");
            }
          });
        }
      });
    }
  });

  return View;
                                 
});
