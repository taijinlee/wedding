define([
  'jquery',
  'underscore',
  'backbone',
  'models/mailSaveTheDate',
  'text!./saveTheDate.html'
], function($, _, Backbone, MailSaveTheDateModel, saveTheDateTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click .sendStd': 'sendStd',
    },

    initialize: function(config, vent, pather, cookie, party) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.party = party;
    },

    render: function() {
      this.$el.html(_.template(saveTheDateTemplate, { party: this.party.toJSON() }));
      return this;
    },

    sendStd: function(event) {
      event.preventDefault(); event.stopPropagation();
      
      var $button = $(event.target);
      $button.attr('disabled', 'disabled');
      $button.html('Sending...');
      new MailSaveTheDateModel().save({
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
