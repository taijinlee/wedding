define([
  'jquery',
  'underscore',
  'backbone',
  'collections/partys',
  'models/mailAddressVerification',
  './filters/filters',
  './statsPane/statsPane',
  'text!./show.html',
  'text!./partyRow.html',
  'text!./addPartyRow.html',
  'text!./priorityButtons.html',
], function($, _, Backbone, PartysCollection, MailAddressVerificationModel, FiltersView, StatsPaneView, showTemplate, partyRowTemplate, addPartyRowTemplate, priorityButtonsTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click .delete': 'deleteParty',
      'click .setPartyPriority': 'setPartyPriority',
      'click .emailAddressVerification': 'emailAddressVerification',
      'click .addressVerify': 'setPartyAddressVerified'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0];
      this.partys = new PartysCollection();
      this.partys.on('reset', this.renderPartys, this);
      this.partys.on('remove', this.removeParty, this);
      this.statsPane = new StatsPaneView(config, vent, pather, cookie, args);
      this.filters = new FiltersView(config, vent, pather, cookie, args);

      this.headers = [
        '',
        'Guest Name',
        'E-mail',
        'Address',
        'Confirm Address',
        'Invite Priority',
        'Delete'
      ];

      this.vent.on('renderPartys', this.renderPartys, this);
    },

    render: function() {
      this.$el.html(_.template(showTemplate));
      this.filters.setElement(this.$el.find('#filters')).render();
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
      this.partys.fetch({
        data: { weddingId: this.weddingId }
      });
    },

    renderPartys: function() {
      var partys = this.partys;
      partys = partys.map(function(party) { return party.toJSON(); });

      var $body = this.$el.find('tbody');
      $body.empty();
      var self = this;
      var priorityButtonsPartial = _.template(priorityButtonsTemplate);

      this.statsPane.setElement(this.$el.find('#weddingStats')).render(partys);

      var filterValues = this.filters.getFilterValues();
      if (filterValues.priorities.length) {
        partys = partys.filter(function(party) { return _.indexOf(filterValues.priorities, party.priority) !== -1; });
      }

      _.each(partys, function(party) {
        var templateVars = {
          party: party,
          address: (party.address || ''),
          editUrl: self.pather.getUrl('partyEdit', { weddingId: self.weddingId, partyId: party.id }),
          priorityButtonsTemplate: priorityButtonsPartial
        };
        $body.append(_.template(partyRowTemplate, templateVars));
      });
      $body.append(_.template(addPartyRowTemplate, { addPartyUrl: this.pather.getUrl('partyNew', { id: this.weddingId }) }));
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
    },

    setPartyPriority: function(event) {
      event.preventDefault(); event.stopPropagation();
      var $priorityButton = $(event.target);
      var priority = $priorityButton.data('priority');
      var partyId = $priorityButton.closest('tr').data('party-id');
      var party = this.partys.get(partyId);

      if ($priorityButton.hasClass('btn-on')) {
        party.set({ priority: 'none' }).save({}, {
          success: function() {
            $priorityButton.removeClass('btn-on');
          }
        });
      } else {
        party.set({ priority: priority }).save({}, {
          success: function() {
            $priorityButton.siblings().removeClass('btn-on');
            $priorityButton.addClass('btn-on');
          }
        });
      }

      this.renderPartys(this.partys);
    },

    setPartyAddressVerified: function(event) {
      event.preventDefault(); event.stopPropagation();
      var partyId = $(event.target).closest('tr').data('party-id');
      var party = this.partys.get(partyId);
      party.set({ addressVerified: true }).save({}, {
        success: function() {
          // MAJOR HACK: should make address field a separate view
          $(event.target).parent().html('Address verified!');
        }
      });
      this.renderPartys(this.partys);

    },

    emailAddressVerification: function(event) {
      event.preventDefault(); event.stopPropagation();
      var partyId = $(event.target).closest('tr').data('party-id');
      new MailAddressVerificationModel({
        userId: this.cookie.get('userId'),
        partyId: partyId
      }).save();
    }

  });

  return View;

});
