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
    events: {
      'click .delete': 'deleteParty',
      'click .invitePriority': 'setInvitePriority'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0];
      this.partys = new PartysCollection();
      this.partys.on('reset', this.renderPartys, this);
      this.partys.on('remove', this.removeParty, this);

      this.headers = [
        '',
        'Guest Name',
        'E-mail',
        'Address',
        "RSVP'ed",
        'Invite Priority',
        'Edit',
        'Delete'
      ];
    },

    render: function() {
      this.$el.html(_.template(emptyTableTemplate));
      var $tr = $(this.make('tr', { 'class': 'table-row' }));
      var self = this;
      _.each(this.headers, function(header) {
        $tr.append(self.make('th', {}, header));
      });
      this.$el.find('thead').append($tr);

      this.partys.fetch({
        data: { weddingId: this.weddingId }
      });
      return this;
    },

    renderPartys: function(partys) {
      var $body = this.$el.find('tbody');
      var self = this;
      partys.each(function(party) {
        var templateVars = {
          party: party.toJSON(),
          address: party.address(),
          editUrl: self.pather.getUrl('partyEdit', { weddingId: self.weddingId, partyId: party.get('id') }),
        };
        $body.append(_.template(partyRowTemplate, templateVars));
      });
      $body.append(_.template(addPartyRowTemplate, { addPartyUrl: this.pather.getUrl('partyNew', { id: this.weddingId }) }));
    },

    removeParty: function(model, collection, options) {
      $('tr[data-party-id="' + model.get('id') + '"]').remove();
    },

    deleteParty: function(event) {
      event.preventDefault() && event.stopPropagation();
      var partyId = $(event.currentTarget).closest('tr').data('party-id');
      if (confirm('Delete party?')) {
        var party = this.partys.get(partyId);
        party.destroy();
        this.partys.remove(party);
      }
    },

    setInvitePriority: function(event) {
      event.preventDefault() && event.stopPropagation();
      var $priorityButton = $(event.target);
      var priority = $priorityButton.data('priority');
      var partyId = $priorityButton.closest('tr').data('party-id');
      var party = this.partys.get(partyId);

      party.set({ priority: priority }).save();

      $priorityButton.siblings().removeClass('btn-on');
      $priorityButton.addClass('btn-on');
    },

  });

  return View;

});
