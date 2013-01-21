define([
  'jquery',
  'underscore',
  'backbone',
  'models/partyAddressVerification',
  'text!./verifyAddress.html',
  'text!./addressForm.html',
], function($, _, Backbone, PartyAddressVerificationModel, verifyAddressTemplate, addressFormTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click button#submit': 'submitAddress'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.partyId = args[0];
      this.accessToken = args[1];
      this.partyAddressVerification = new PartyAddressVerificationModel({ id: this.partyId });
      this.partyAddressVerification.on('change', this.renderAddress, this);
    },

    render: function() {
      this.$el.html(_.template(verifyAddressTemplate));
      this.partyAddressVerification.fetch({
        data: { accessToken: this.accessToken }
      });
      return this;
    },

    renderAddress: function() {
      var $addressInput = this.$el.find('#addressInput');
      $addressInput.html(_.template(addressFormTemplate, { address: this.partyAddressVerification.get('address'), showButtons: true }));
      return this;
    },

    submitAddress: function(event) {
      event.preventDefault(); event.stopPropagation();
      var values = { accessToken: this.accessToken };
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      var self = this;
      this.partyAddressVerification.save(values, {
        error: function(model, response) {
          self.vent.trigger('renderNotification', 'Error', 'error');
          console.log(model);
          console.log(response);
        },
        success: function(model, response) {
          self.$el.find('#addressVerifyContainer').html('<h2>Thanks!</h2>');
          console.log(model);
          console.log(response);
          console.log(self.vent);
          // this.vent.trigger('renderNotification', 'An email has been sent to you', 'success');
        }
      });



    }

  });

  return View;

});
