define([
  'jquery',
  'underscore',
  'backbone',
  'models/party',
  'text!./new.html',
  'text!./addFormRow.html',
  'text!./addressForm.html'
], function($, _, Backbone, PartyModel, addFormTemplate, addFormRowTemplate, addressFormTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click #addSubmit': 'createGuest',
      'focus #addGuests div.row:last-child': 'addGuest'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0];
      this.partyId = args[1];
      this.guestNum = 0;

      this.guestTable = {
        salutation: 'Salutation',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email'
      };
      this.addressForm = {
        address1: 'Address',
        city: 'City',
        state: 'State',
        zip: 'Zip'
      };

      this.party = new PartyModel({ id: this.partyId });
      this.party.on('change', this.renderPartyInfo, this);
    },

    render: function() {
      if (this.partyId) {
        this.party.fetch();
        return this;
      }
      this.renderPartyInfo();
      return this;
    },

    renderPartyInfo: function() {
      this.$el.html(_.template(addFormTemplate, { backUrl: this.pather.getUrl('weddingShow', { id: this.weddingId }) }));
      var $guestSection = this.$el.find('#addGuests');
      var self = this;

      var guests = this.party.get('guests');
      if (!guests || guests.length === 0) { guests = [{}]; }
      _.each(guests, function(guest) {
        $guestSection.append(_.template(addFormRowTemplate, { guestNum: self.guestNum, guest: guest  }));
        self.guestNum++;
      });

      var $addressSection = this.$el.find('#addAddress');
      $addressSection.html(_.template(addressFormTemplate, { party: this.party.toJSON() }));
    },

    addGuest: function() {
      var $guestSection = this.$el.find('#addGuests');
      $guestSection.append(_.template(addFormRowTemplate, { guestNum: this.guestNum, guest: {} }));
      this.guestNum++;
      return false;
    },

    createGuest: function(event) {
      event.preventDefault();
      event.stopPropagation();

      var values = { weddingId: this.weddingId };
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      var partyData = {};
      var guests = {};
      var guestRegexp = /guest_(\d)_(\w+)/
      _.each(values, function(value, formKey) {
        if (formKey.indexOf('guest') === -1) {
          if (value) { partyData[formKey] = value; }
          return;
        }
        var matches = formKey.match(guestRegexp);
        var guestNum = matches[1];
        var guestProp = matches[2];
        if (!guests[guestNum]) { guests[guestNum] = {}; }
        guests[guestNum][guestProp] = value;
      });

      guests = _.filter(guests, function(guest) {
        var allEmpty = true;
        for (var property in guest) {
          if (guest[property]) { allEmpty = false; }
        }
        return !allEmpty;
      });
      partyData.guests = guests;

      this.party.set(partyData);
      // var party = new PartyModel(partyData);
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
          Backbone.history.navigate(self.pather.getUrl('weddingShow', { id: self.weddingId }), { trigger: true });
          console.log(model);
          console.log(response);
          console.log(self.vent);
          // this.vent.trigger('renderNotification', 'An email has been sent to you', 'success');
        }
      });

      return false;
    }

  });

  return View;

});
