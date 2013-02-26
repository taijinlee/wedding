define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'models/wedding',
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
  './partysTable/addressed',
  './partysTable/invitation',
  'text!./partysTable.html',
  'text!./partyRow.html',
  'text!./addPartyRow.html'
], function($, _, Backbone, async, WeddingModel, PartysCollection,
            FiltersView, StatsView, StatsCategoryView, StatsAddressView, StatsPriorityView, StatsStdRsvpView,
            AddressView, PriorityView, CategoryView, SaveTheDateView, AddressedView, InvitationView,
            partysTableTemplate, partyRowTemplate, addPartyRowTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click .delete': 'deleteParty',
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0];

      this.filters = new FiltersView(config, vent, pather, cookie);

      this.partys = new PartysCollection();
      this.partys.on('reset', this.renderPartys, this);
      this.partys.on('remove', this.removeParty, this);

      this.headers = [
        '',
        'Guest Name',
        'E-mail',
        'Priority',
        'Category',
        'Address',
        'Save the Date',
        'Invitation',
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
//      this.vent.on('guestList:addressedUpdate', this.renderPartys, this);
    },

    render: function() {
      var self = this;
      async.auto({
        wedding: function(done) {
          if (self.weddingId) {
            new WeddingModel({ id: self.weddingId }).fetch({
              success: function(wedding) {
                return done(null, wedding);
              },
              error: function() {
                return done(new Error('generic error?'));
              }
            });
          } else {
            new WeddingModel().fetch({
              data: {
                userId: self.cookie.get('userId')
              },
              success: function(wedding) {
                self.weddingId = wedding.get('id');
                return done(null, wedding);
              },
              error: function() {
                return done(new Error('generic error?'));
              }
            });
          }
        }
      }, function(error, results) {
        if (error) { return; } // do something?
        var partysTableTemplateVars = {
          wedding: results.wedding,
          settingsLink: self.pather.getUrl('weddingSettings', { weddingId: self.weddingId })
        };
        self.$el.html(_.template(partysTableTemplate, partysTableTemplateVars));
        self.filters.setElement(self.$el.find('#filters')).render(self.weddingId);

        var $tr = $(self.make('tr', { 'class': 'table-row' }));
        _.each(self.headers, function(header) {
          $tr.append(self.make('th', {}, header));
        });
        self.$el.find('thead').append($tr);

        self.statsCategory.setElement(self.$el.find('#statsCategory')).render();
        self.statsAddress.setElement(self.$el.find('#statsAddress')).render();
        self.statsPriority.setElement(self.$el.find('#statsPriority')).render();
        self.statsStdRsvp.setElement(self.$el.find('#statsStdRsvp')).render();

        self.partys.fetch({
          data: { weddingId: self.weddingId }
        });
      });
      return this;
    },

    renderPartys: function() {
      this.vent.trigger('guestList:partysUpdate', this.partys);

      var filterValues = this.filters.getFilterValues();
      var $body = this.$el.find('tbody');
      $body.empty();
      filterValues = filterValues || {};

      this.partys.each(function(party) {
        var partyJSON = party.toJSON();

        if (filterValues.priorities && filterValues.priorities.length) {
          if (_.indexOf(filterValues.priorities, partyJSON.priority) === -1) { return; }
        }
        if (filterValues.categories && filterValues.categories.length) {
          if (_.indexOf(filterValues.categories, partyJSON.category) === -1) { return; }
        }
//        if (filterValues.addresseds && filterValues.addresseds.length) {
//          if (_.indexOf(filterValues.addresseds, partyJSON.isAddressed) === -1) { return; }
//        }
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

        _.each(partyJSON.guests, function(guest, index) {
          var $stdEl = $row.find('#guestListStd-' + partyJSON.id + '-' + index);
          var stdView = new SaveTheDateView(this.config, this.vent, this.pather, this.cookie, party);
          stdView.setElement($stdEl).render(guest, index);

          var $invEl = $row.find('#guestListInv-' + partyJSON.id + '-' + index);
          var invView = new InvitationView(this.config, this.vent, this.pather, this.cookie, party);
          invView.setElement($invEl).render(guest, index);
        }, this);

//        var $addressedEl = $row.find('#guestListAddressed-' + partyJSON.id);
//        var addressedView = new AddressedView(this.config, this.vent, this.pather, this.cookie, party);
//        addressedView.setElement($addressedEl).render();

        $row.find('.guestEmail').editable({
          type: 'text',
          url: function(data) {
            var d = new $.Deferred();
            var guests = party.get('guests');
            guests[data.pk].email = data.value;
            party.save({ guests: guests }, {
              success: function() { return d.resolve(); },
              error: function() { return d.reject('error!'); }
            });
            return d.promise();
          },
          title: 'Guest email'
        });

        $row.find('.guestName').editable({
          type: 'text',
          url: function(data) {
            var d = new $.Deferred();
            var guests = party.get('guests');
            guests[data.pk].name = data.value;
            party.save({ guests: guests }, {
              success: function() { return d.resolve(); },
              error: function() { return d.reject('error!'); }
            });
            return d.promise();
          },
          title: 'Guest name'
        });


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
      }
    }
  });

  return View;

});
