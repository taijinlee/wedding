define([
  'jquery',
  'underscore',
  'backbone',
  'models/mailAddressVerification',
  'text!./address.html'
], function($, _, Backbone, MailAddressVerificationModel, addressTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click .emailAddressVerification': 'emailAddressVerification',
      'click .addressVerify': 'setPartyAddressVerified'
    },

    initialize: function(config, vent, pather, cookie, party) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.party = party;
    },

    render: function() {
      this.$el.html(_.template(addressTemplate, { party: this.party.toJSON() }));

      var self = this;
      this.$el.find('#partyAddress').editable({
        type: 'textarea',
        url: function(data) {
          var d = new $.Deferred();
          console.log(data.value);
          self.party.save({ address: data.value }, {
            success: function() { return d.resolve(); },
            error: function() { return d.reject('error!'); }
          });
          return d.promise();
        },
        title: 'Address'
      });
      return this;
    },

    setPartyAddressVerified: function(event) {
      event.preventDefault(); event.stopPropagation();
      var self = this;
      this.party.save({ addressVerified: true }, {
        success: function() {
          self.vent.trigger('guestList:addressUpdate');
        },
        error: function() {
          // something went wrong...
          console.log(self.party);
        }
      });
    },

    emailAddressVerification: function(event) {
      event.preventDefault(); event.stopPropagation();

      var $button = $(event.target);
      $button.attr('disabled', 'disabled');
      $button.html('sending...');

      new MailAddressVerificationModel().save({
        userId: this.cookie.get('userId'),
        partyId: this.party.get('id')
      }, {
        success: function() {
          $button.html('Email sent!');
        }
      });
    }

  });

  return View;

});
