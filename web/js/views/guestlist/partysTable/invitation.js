define([
  'jquery',
  'underscore',
  'backbone',
  'models/mailInvitation',
  'text!./invitation.html'
], function($, _, Backbone, MailInvitationModel, invitationTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click #sendInv': 'sendInv',
    },

    initialize: function(config, vent, pather, cookie, party) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.party = party;
    },

    render: function(guest, guestIndex) {
      this.$el.html(_.template(invitationTemplate, { guest: guest, guestIndex: guestIndex, invSentDate: this.party.get('invSentDate') }));
      return this;
    },

    sendInv: function(event) {
      console.log("Sending invitation");
      self = this;
      event.preventDefault(); event.stopPropagation();

      var $button = $(event.target);
      $button.attr('disabled', 'disabled').html('Sending...');
      new MailInvitationModel().save({
        userId: this.cookie.get('userId'),
        partyId: this.party.get('id')
      }, {
        success: function() {
          $button.html('Sent!');
        }
      });
    }
  });

  return View;

});
