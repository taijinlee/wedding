define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/statsPane/statsPane'
], function($, _, Backbone, StatsPaneView) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.statsPane = new StatsPaneView();
      this.vent.on('guestList:partysUpdate', this.renderStats, this);
    },

    render: function() {
      this.$el.html('loading');
    },

    renderStats: function(partys) {
      var stats = partys.map(function(party) {
        var guests = party.get('guests');
        var guestStats = _.reduce(guests, function(memo, guestStats) {
          if (guestStats['isAttending']) {
            memo['isAttending'] += 1;
          } else {
            if (typeof guestStats['isAttending'] === 'undefined') {
              memo['none'] += 1;
            } else {
              memo['notAttending'] += 1;
            }
          }
          return memo;
        }, {isAttending: 0, none: 0, notAttending: 0 });

        return { priority: party.get('priority'), numGuests: party.get('guests').length, addressVerified: party.get('addressVerified'), category: party.get('category'), guestStats: guestStats }
      });

      var defaultMemo = {
        total: { display: 'Total', value: 0 },
        hr1: {},
        a: { display: 'A', value: 0 },
        b: { display: 'B', value: 0 },
        c: { display: 'C', value: 0 },
        noPriority: { display: 'None', value: 0 },
        hr2: {},
        addressVerified: { display: 'Address Verified', value: 0 },
        notAddressVerified: { display: 'Not verified', value: 0 },
        hr3: {},
        bride: {display: 'Bride', value: 0 },
        groom: {display: 'Groom', value: 0 },
        noCategory: {display: 'None', value: 0},
        hr4: {},
        stdRsvpYes: {display: 'Responded Yes to Save the Date', value: 0},
        stdRsvpNo: {display: 'Responded No to Save the Date', value: 0},
        stdRsvpNone: {display: 'No response to Save the Date', value: 0}
      };

      stats = _.reduce(stats, function(memo, partyStats) {
        memo.total.value += partyStats.numGuests;
        if (partyStats.priority && memo[partyStats.priority]) {
          memo[partyStats.priority].value += partyStats.numGuests;
        } else {
          memo.noPriority.value += partyStats.numGuests;
        }

        if (partyStats.addressVerified) {
          memo.addressVerified.value += partyStats.numGuests;
        } else {
          memo.notAddressVerified.value += partyStats.numGuests;
        }

        if (partyStats.category && memo[partyStats.category]) {
          memo[partyStats.category].value += partyStats.numGuests;
        } else {
          memo.noCategory.value += partyStats.numGuests;
        }

        if (partyStats.guestStats.isAttending) {
          memo.stdRsvpYes.value += partyStats.guestStats.isAttending;
        }

        if (partyStats.guestStats.notAttending) {
          memo.stdRsvpNo.value += partyStats.guestStats.notAttending;
        }

        if (partyStats.guestStats.none) {
          memo.stdRsvpNone.value += partyStats.guestStats.none;
        }

        return memo;
      }, defaultMemo);

      this.statsPane.setElement(this.$el).render(stats, 'Guest counts');
    }

  });

  return View;

});
