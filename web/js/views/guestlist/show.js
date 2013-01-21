define([
  'jquery',
  'underscore',
  'backbone',
  'collections/partys',
  './filters/filters',
  './stats/stats',
  './stats/category',
  './stats/address',
  './stats/priority',
  './stats/stdRsvp',
  './partysTable/address',
  './partysTable/priority',
  './partysTable/category',
  './partysTable/saveTheDate',
  'text!./partysTable.html',
  'text!./partyRow.html',
  'text!./addPartyRow.html'
], function($, _, Backbone, PartysCollection,
            FiltersView, StatsView, StatsCategoryView, StatsAddressView, StatsPriorityView, StatsStdRsvpView,
            AddressView, PriorityView, CategoryView, SaveTheDateView, partysTableTemplate, partyRowTemplate, addPartyRowTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0];

      this.filters = new FiltersView(config, vent, pather, cookie, this.weddingId);

      this.partys = new PartysCollection();
      this.partys.on('reset', this.renderPartys, this);
      this.partys.on('remove', this.removeParty, this);

      this.headers = [
        '',
        'Guest Name',
        'E-mail',
        'Category',
        'Address',
        'Invite Priority',
        'Save the Date',
        'Attending?',
        'Delete'
      ];

      this.statsView = new StatsView(this.config, this.vent, this.pather, this.cookie);
      this.statsCategory = new StatsCategoryView(this.config, this.vent, this.pather, this.cookie);
      this.statsAddress = new StatsAddressView(this.config, this.vent, this.pather, this.cookie);
      this.statsPriority = new StatsPriorityView(this.config, this.vent, this.pather, this.cookie);
      this.statsStdRsvp = new StatsStdRsvpView(this.config, this.vent, this.pather, this.cookie);

      this.vent.on('guestList:categoryUpdate', this.renderPartys, this);
      this.vent.on('guestList:filterUpdate', this.renderPartys, this);
      this.vent.on('guestList:addressUpdate', this.renderPartys, this);
      this.vent.on('guestList:priorityUpdate', this.renderPartys, this);
    },

    render: function() {
      this.$el.html(_.template(partysTableTemplate));
      this.filters.setElement(this.$el.find('#filters')).render();

      var $tr = $(this.make('tr', { 'class': 'table-row' }));
      var self = this;
      _.each(this.headers, function(header) {
        $tr.append(self.make('th', {}, header));
      });
      this.$el.find('thead').append($tr);

      this.statsCategory.setElement(this.$el.find('#statsCategory')).render();
      this.statsAddress.setElement(this.$el.find('#statsAddress')).render();
      this.statsPriority.setElement(this.$el.find('#statsPriority')).render();
      this.statsStdRsvp.setElement(this.$el.find('#statsStdRsvp')).render();

      this.partys.fetch({
        data: { weddingId: this.weddingId }
      });
      return this;
    },

    renderPartys: function(filterValues) {
      this.vent.trigger('guestList:partysUpdate', this.partys);
      var $body = this.$el.find('tbody');
      $body.empty();
      filterValues = filterValues || {};

      this.partys.each(function(party) {
        var partyJSON = party.toJSON();

        if (filterValues.priorities && filterValues.priorities.length) {
          if (_.indexOf(filterValues.priorities, partyJSON.priority) === -1) { return; }
        }
        if (filterValues.category && filterValues.category !== "none") {
          if (filterValues.category !== partyJSON.category) { return; }
        }

        var templateVars = {
          party: partyJSON,
          editUrl: this.pather.getUrl('partyEdit', { weddingId: this.weddingId, partyId: partyJSON.id })
        };
        var $row = $(_.template(partyRowTemplate, templateVars));

        var $categoryEl = $row.find('#guestListCategory-' + partyJSON.id);
        var categoryView = new CategoryView(this.config, this.vent, this.pather, this.cookie, party);
        categoryView.setElement($categoryEl).render();

        var $addressEl = $row.find('#guestListAddress-' + partyJSON.id);
        var addressView = new AddressView(this.config, this.vent, this.pather, this.cookie, party);
        addressView.setElement($addressEl).render();

        var $priorityEl = $row.find('#guestListPriority-' + partyJSON.id);
        var priorityView = new PriorityView(this.config, this.vent, this.pather, this.cookie, party);
        priorityView.setElement($priorityEl).render();

        var $stdEl = $row.find('#guestListStd-' + partyJSON.id);
        var stdView = new SaveTheDateView(this.config, this.vent, this.pather, this.cookie, party);
        stdView.setElement($stdEl).render();

        $body.append($row);
      }, this);
      $body.append(_.template(addPartyRowTemplate, { addPartyUrl: this.pather.getUrl('partyNew', { weddingId: this.weddingId }) }));
    },

    removeParty: function(model, collection, options) {
      $('tr[data-party-id="' + model.get('id') + '"]').remove();
    },

    deleteParty: function(event) {
      event.preventDefault(); event.stopPropagation();
      var partyId = $(event.currentTarget).closest('tr').data('party-id');
      if (window.confirm('Delete party?')) {
        var party = this.partys.get(partyId);
        party.destroy();
        this.partys.remove(party);
        this.renderPartys(this.partys);
      }
    }

  });

  return View;

});
