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
        address: 'Address',
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
      var backUrl = this.pather.getUrl('guestlist', { weddingId: this.weddingId });
      this.$el.html(_.template(addFormTemplate, { backUrl: backUrl, partyId: this.partyId }));
      var $guestSection = this.$el.find('#addGuests');
      var self = this;

      var guests = this.party.get('guests');
      var salutations = { mr: "Mr.",
                          mrs: "Mrs.",
                          ms: "Ms.",
                          miss: "Miss",
                          dr: "Dr" };
      if (!guests || guests.length === 0) { guests = []; }
      guests.push({});
      _.each(guests, function(guest) {
        $guestSection.append(_.template(addFormRowTemplate, { guestNum: self.guestNum, guest: guest, salutations: salutations }));
        self.guestNum++;
      });

      var $addressSection = this.$el.find('#addAddress');
      $addressSection.html(_.template(addressFormTemplate, { party: this.party.toJSON(), showButtons: false }));
    },

    addGuest: function() {
      var $guestSection = this.$el.find('#addGuests');
      $guestSection.append(_.template(addFormRowTemplate, { guestNum: this.guestNum, guest: {} }));
      this.guestNum++;
      return false;
    },

    createGuest: function(event) {
      event.preventDefault(); event.stopPropagation();

      var values = { weddingId: this.weddingId };
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      var guestRegexp = /guest_(\d)_(\w+)/;
      var partyData = _.reduce(values, function(memo, value, formKey) {
        if (!value) { return memo; }
        if (formKey.indexOf('guest') === -1) {
          memo[formKey] = value;
          return memo;
        }
        var matches = formKey.match(guestRegexp);
        var guestNum = matches[1];
        var guestProp = matches[2];
        if (!memo.guests[guestNum]) { memo.guests[guestNum] = {}; }
        memo.guests[guestNum][guestProp] = value;
        return memo;
      }, { guests: {} });

      partyData.guests = _.map(partyData.guests, function(guest) { return guest; });

      var self = this;
      this.party.save(partyData, {
        error: function(model, response) {
          self.vent.trigger('renderNotification', 'Error', 'error');
          console.log(model);
          console.log(response);
        },
        success: function(model, response) {
          Backbone.history.navigate(self.pather.getUrl('guestlist', { weddingId: self.weddingId }), { trigger: true });
          console.log(model);
          console.log(response);
          console.log(self.vent);
          // this.vent.trigger('renderNotification', 'An email has been sent to you', 'success');
        },
        // weird ass shit going on here... partyData.guests gets corrupted when save goes. console.log is async?
        silent: true
      });

      return false;
    }

  });

  return View;

});
