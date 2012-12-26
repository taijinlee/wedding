define([
  'jquery',
  'underscore',
  'backbone',
  'collections/partys',
  'text!./emptyTable.html',
  'text!./partyRow.html',
  'text!./addPartyRow.html',
  'text!./priorityButtons.html'
], function($, _, Backbone, PartysCollection, emptyTableTemplate, partyRowTemplate, addPartyRowTemplate, priorityButtonsTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click .delete': 'deleteParty',
      'click .setPartyPriority': 'setPartyPriority',
      'click #party-priority-filter button': 'setPriorityFilter'
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
        'Invite Priority',
        'Edit',
        'Delete'
      ];
    },

    render: function() {
      this.$el.html(_.template(emptyTableTemplate));
      this.$el.find('#party-priority-filter').html(_.template(priorityButtonsTemplate, { priority: '' }));
      var $tr = $(this.make('tr', { 'class': 'table-row' }));
      var self = this;
      _.each(this.headers, function(header) {
        $tr.append(self.make('th', {}, header));
      });
      this.$el.find('thead').append($tr);

      this.refreshPartys();
      return this;
    },

    refreshPartys: function() {
      var priorities = $('#party-priority-filter .btn-group').children().filter('.btn-on').map(function(index, el) { return $(el).data('priority'); }).toArray();
      this.partys.fetch({
        data: { weddingId: this.weddingId, priority: { $in: priorities } }
      });
    },

    renderPartys: function(partys) {
      var $body = this.$el.find('tbody');
      $body.empty();
      var self = this;
      var priorityButtonsPartial = _.template(priorityButtonsTemplate);
      partys.each(function(party) {
        var templateVars = {
          party: party.toJSON(),
          address: party.address(),
          editUrl: self.pather.getUrl('partyEdit', { weddingId: self.weddingId, partyId: party.get('id') }),
          priorityButtonsTemplate: priorityButtonsPartial
        };
        $body.append(_.template(partyRowTemplate, templateVars));
      });
      $body.append(_.template(addPartyRowTemplate, { addPartyUrl: this.pather.getUrl('partyNew', { id: this.weddingId }) }));
    },

    removeParty: function(model, collection, options) {
      $('tr[data-party-id="' + model.get('id') + '"]').remove();
    },

    setPriorityFilter: function(event) {
      event.preventDefault(); event.stopPropagation();
      var $selectedPriority = $(event.target);
      $selectedPriority.toggleClass('btn-on');
      this.refreshPartys();
    },

    deleteParty: function(event) {
      event.preventDefault(); event.stopPropagation();
      var partyId = $(event.currentTarget).closest('tr').data('party-id');
      if (window.confirm('Delete party?')) {
        var party = this.partys.get(partyId);
        party.destroy();
        this.partys.remove(party);
      }
    },

    setPartyPriority: function(event) {
      event.preventDefault(); event.stopPropagation();
      var $priorityButton = $(event.target);
      var priority = $priorityButton.data('priority');
      var partyId = $priorityButton.closest('tr').data('party-id');
      var party = this.partys.get(partyId);

      party.set({ priority: priority }).save();

      $priorityButton.siblings().removeClass('btn-on');
      $priorityButton.addClass('btn-on');
      this.refreshPartys();
    },

  });

  return View;

});
