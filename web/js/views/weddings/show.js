define([
  'jquery',
  'underscore',
  'backbone',
  'collections/partys',
  'text!./emptyTable.html',
  'text!./partyRow.html'
], function($, _, Backbone, PartysCollection, emptyTableTemplate, partyRowTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0] || null;
      this.partys = new PartysCollection();
      this.partys.on('reset', this.renderPartys, this);

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
      $tr.append(self.make('th', {}, self.make('a', { 'class': 'btn pull-right', href: self.pather.getUrl('partyNew', { weddingId: this.weddingId }) }, 'Add Party')));
      this.$el.find('thead').append($tr);

      this.partys.fetch();
      return this;
    },

    renderPartys: function(partys) {
      var $body = this.$el.find('tbody');
      var self = this;
      partys.each(function(party) {
        $body.append(_.template(partyRowTemplate, party.toJSON()));
      });
    }
  });

  return View;

});
