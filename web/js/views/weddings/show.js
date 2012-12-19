define([
  'jquery',
  'underscore',
  'backbone',
  'collections/partys',
  'text!./emptyTable.html',
  'text!./partyRow.html',
  'text!./addPartyRow.html'
], function($, _, Backbone, PartysCollection, emptyTableTemplate, partyRowTemplate, addPartyRowTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0];
      this.partys = new PartysCollection();
      this.partys.on('reset', this.renderPartys, this);

      this.headers = [
        'Guest Name',
        'E-mail',
        'Address',
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
      this.$el.find('thead').append($tr);

      this.partys.fetch();
      return this;
    },

    renderPartys: function(partys) {
      var $body = this.$el.find('tbody');
      var self = this;
      partys.each(function(party) {
        $body.append(_.template(partyRowTemplate, { guests: party.get('guests'), address: party.address() }));
      });
      $body.append(_.template(addPartyRowTemplate, { addPartyUrl: this.pather.getUrl('partyNew', { id: this.weddingId }) }));
    }
  });

  return View;

});
