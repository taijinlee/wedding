define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.vent.on('guestList:partysUpdate', this.calculateStats, this);
    },

    calculateStats: function(partys) {
      this.stats = partys.reduce(function(memo, party) {
        var partyJSON = party.toJSON();
        var numGuests = partyJSON.guests.length;

        memo.totalGuests += numGuests;

        /* priorities */
        if (partyJSON.priority && memo.priorities[partyJSON.priority] !== undefined) {
          memo.priorities[partyJSON.priority] += numGuests;
        } else {
          memo.priorities.none += numGuests;
        }

        /* address verification */
        if (partyJSON.addressVerified) {
          memo.address.verified += numGuests;
        } else {
          memo.address.notVerified += numGuests;
        }

        /* categories */
        if (partyJSON.category && memo.categories[partyJSON.category] !== undefined) {
          memo.categories[partyJSON.category] += numGuests;
        } else {
          memo.categories.none += numGuests;
        }

        /* std rsvp */
        _.each(partyJSON.guests, function(guest) {
          /* Save the date responses */
          if (guest.isAttending === true) {
            memo.stdRsvp.isAttending += 1;
          } else if (guest.isAttending === false) {
            memo.stdRsvp.notAttending += 1;
          } else {
            memo.stdRsvp.none += 1;
          }
        });
        return memo;
      }, {
        totalGuests: { },
        priorities: { a: 0, b: 0, c: 0, none: 0 },
        address: { verified: 0, notVerified: 0 },
        categories: { bride: 0, groom: 0, none: 0 },
        stdRsvp: { isAttending: 0, notAttending: 0, none: 0 }
      });

      this.vent.trigger('statsCalculated', this.stats);
    }

  });

  return View;

});
