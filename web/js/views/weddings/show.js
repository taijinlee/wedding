define([
  'jquery',
  'underscore',
  'backbone',
  'collections/guests',
  'text!./emptyTable.html',
  'text!./guestRow.html'
], function($, _, Backbone, GuestsCollection, emptyTableTemplate, guestRowTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0];
      this.guests = new GuestsCollection();
      this.guests.on('reset', this.renderGuests, this);

      this.headers = [
        'First Name',
        'Last Name',
        'Address',
        'E-mail',
        "RSVP'ed"
      ];
    },

    render: function() {
      this.$el.html(_.template(emptyTableTemplate));
      var $tr = $(this.make('tr'));
      var self = this;
      _.each(this.headers, function(header) {
        $tr.append(self.make('th', {}, header));
      });
      $tr.append(self.make('th', {}, self.make('a', { 'class': 'btn pull-right', href: self.pather.getUrl('guestNew', { weddingId: this.weddingId }) }, 'Add Guest')));
      this.$el.find('thead').append($tr);

      this.guests.fetch();
      return this;
    },

    renderGuests: function(guests) {
      var $body = this.$el.find('tbody');
      var self = this;
      guests.each(function(guest) {
        $body.append(_.template(guestRowTemplate, guest.toJSON()));
      });
    }
  });

  return View;

});
