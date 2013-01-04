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
    },

    render: function(partys) {
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
      };
      var stats = _.chain(partys).map(function(party) {
        return { priority: party.priority, numGuests: party.guests.length, addressVerified: party.addressVerified };
      }).reduce(function(memo, partyStats) {
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

        return memo;
      }, defaultMemo).value();
      this.statsPane.setElement(this.$el).render(stats, 'Guest counts');
    }

  });

  return View;

});
