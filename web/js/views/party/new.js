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
      'focus #addGuests div.row:last-child': 'addGuestEvent'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0];
      this.partyId = args[1];
      this.guestNum = 0;

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
      if (!guests || guests.length === 0) { guests = []; }
      guests.push({});
      _.each(guests, function(guest) { self.addGuest(guest); });

      var $addressSection = this.$el.find('#addAddress');
      $addressSection.html(_.template(addressFormTemplate, { address: this.party.get('address'), showButtons: false }));
    },

    addGuestEvent: function() {
      this.addGuest({});
    },

    addGuest: function(guest) {
      var $guestSection = this.$el.find('#addGuests');
      var $guestRow = $(_.template(addFormRowTemplate, { guestNum: this.guestNum, guest: guest }));

      $guestRow.find('#name').autocomplete('/api/contacts', {
        processData: function(response) {
          return _.map(response.data, function(contact) {
            return { value: contact.name, data: contact };
          });
        },
        matchSubset: false,
        queryParamName: 'keywords',
        remoteDataType: 'json',
        minChars: 1,
        onItemSelect: function(elemData) {
          var contact = elemData.data;
          if (contact.email) {
            $guestRow.find('#email').val(contact.email);
          }
        }
      });
      $guestSection.append($guestRow);

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
      if (!partyData.guests.length) {
        this.vent.trigger('renderNotification', 'Please add a guest', 'error');
        return;
      }

      var self = this;
      this.party.save(partyData, {
        error: function(model, response) {
          self.vent.trigger('renderNotification', 'Server error', 'error');
        },
        success: function(model, response) {
          Backbone.history.navigate(self.pather.getUrl('guestlist', { weddingId: self.weddingId }), { trigger: true });
        },
        silent: true
      });

      return false;
    }

  });

  return View;

});
