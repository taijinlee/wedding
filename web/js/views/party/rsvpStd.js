define([
  'jquery',
  'underscore',
  'backbone',
  'models/party',
  'text!./rsvpStd.html',
  'text!./rsvpStdFormRow.html'
], function($, _, Backbone, PartyModel, rsvpStdTemplate, rsvpStdFormRow) {

  var View = Backbone.View.extend({
    events: {
      'click button#submit': 'submit'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.partyId = args[0];
      this.accessToken = args[1];
      this.party = new PartyModel({ id: this.partyId });
      this.party.on('change', this.renderFormTable, this);
    },

    render: function() {
      this.$el.html(_.template(rsvpStdTemplate));
      this.party.fetch({
        data: { accessToken: this.accessToken }
      });
      return this;
    },

    renderFormTable: function() {
      var $tableBody = this.$el.find('#rsvpStdForm tbody');
      $tableBody.empty();
      _.each(this.party.get('guests'), function(guest, index) {
        if (guest.isAttendingStd === undefined || guest.isAttendingStd === null) {
          guest.isAttendingStd = true;
        }
        $tableBody.append(_.template(rsvpStdFormRow, { guest: guest, index: index }));
      });
      return this;
    },

    submit: function(event) {
      event.preventDefault(); event.stopPropagation();
      var values = {};
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      var attendingRegex = /attending-(\d+)/;
      var guests = this.party.get('guests');
      _.each(values, function(isAttendingStd, key) {
        var matches = attendingRegex.exec(key);
        if (!matches) { return; }
        isAttendingStd = parseInt(isAttendingStd, 10);
        guests[parseInt(matches[1], 10)].isAttendingStd = Boolean(isAttendingStd);
      });

      var self = this;
      this.party.save({ guests: guests, accessToken: this.accessToken }, {
        error: function(model, response) {
          self.vent.trigger('renderNotification', 'Error', 'error');
          console.log(model);
          console.log(response);
        },
        success: function(model, response) {
          self.$el.find('#rsvpContainer').html('<h2>Thanks!</h2>');
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
