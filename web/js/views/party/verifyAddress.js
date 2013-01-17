define([
  'jquery',
  'underscore',
  'backbone',
  'models/party',
  'text!./verifyAddress.html',
  'text!./addressForm.html',
], function($, _, Backbone, PartyModel, verifyAddressTemplate, addressFormTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click button#submit': 'submitAddress'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.partyId = args[0];
      this.accessToken = args[1];
      this.party = new PartyModel({ id: this.partyId });
      this.party.on('change', this.renderAddress, this);
    },

    render: function() {
      this.$el.html(_.template(verifyAddressTemplate));
      this.party.fetch({
        data: { accessToken: this.accessToken }
      });
      return this;
    },

    renderAddress: function() {
      var $addressForm = this.$el.find('#addressForm');
      $addressForm.html(_.template(addressFormTemplate, { address: this.party.get('address'), showButtons: true }));
      return this;
    },

    submitAddress: function(event) {
      event.preventDefault(); event.stopPropagation();
      var values = { accessToken: this.accessToken };
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      this.party.set(values);
      if (!this.party.isValid()) {
        this.vent.trigger('renderNotification', 'blah', 'error');
        return false;
      }

      var self = this;
      this.party.save({}, {
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
