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
      return this;
    },

    setPartyAddressVerified: function(event) {
      event.preventDefault(); event.stopPropagation();
      this.party.set({ addressVerified: true }).save({}, {
        success: function() {
          // MAJOR HACK: should make address field a separate view
          $(event.target).parent().html('Address verified!');
        }
      });
      this.renderPartys(this.partys);
    },

    emailAddressVerification: function(event) {
      event.preventDefault(); event.stopPropagation();
      new MailAddressVerificationModel({
        userId: this.cookie.get('userId'),
        partyId: this.party.get('id')
      }).save();
    }

  });

  return View;

});
