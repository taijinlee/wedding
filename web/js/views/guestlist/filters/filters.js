define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/buttonGroup/priority',
  'views/lib/buttonGroup/category',
  'views/lib/buttonGroup/addressed',
  'text!./filters.html',
  'text!../categorySelector.html'
], function($, _, Backbone, PriorityButtonsView, CategoryButtonsView, AddressedButtonsView, filtersTemplate, categorySelectorTemplate) {
  var View = Backbone.View.extend({
    events: {
      'click #party-priority-filter button': 'setPriorityFilter',
      'click #party-category-filter button' : 'setCategoryFilter',
      'click #party-addressed-filter button' : 'setAddressedFilter',
      'click #filter-export button': 'exportToCsv'
    },

    initialize: function(config, vent, pather, cookie) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.priorityFilter = new PriorityButtonsView(config, vent, pather, cookie);
      this.categoryFilter = new CategoryButtonsView(config, vent, pather, cookie);
      this.addressedFilter = new AddressedButtonsView(config, vent, pather, cookie);
    },

    render: function(weddingId) {
      this.weddingId = weddingId;
      this.$el.html(_.template(filtersTemplate));
      this.priorityFilter.setElement(this.$el.find('#party-priority-filter')).render(true);
      this.categoryFilter.setElement(this.$el.find('#party-category-filter')).render(true);
      this.addressedFilter.setElement(this.$el.find('#party-addressed-filter')).render(true);
    },

    setPriorityFilter: function(event) {
      event.preventDefault(); event.stopPropagation();
      var $selectedPriority = $(event.target);
      $selectedPriority.toggleClass('btn-on');
      this.vent.trigger('guestList:filterUpdate', this.getFilterValues());
    },

    setCategoryFilter: function(event) {
      event.preventDefault(); event.stopPropagation();
      var $selectedCategory = $(event.target);
      $selectedCategory.toggleClass('btn-on');
      this.vent.trigger('guestList:filterUpdate', this.getFilterValues());
    },

    setAddressedFilter: function(event) {
      event.preventDefault(); event.stopPropagation();
      var $selectedAddressed = $(event.target);
      $selectedAddressed.toggleClass('btn-on');
      this.vent.trigger('guestList:filterUpdate', this.getFilterValues());
    },

    getFilterValues: function() {
      return {
        priorities: this.priorityFilter.getValues(),
        categories: this.categoryFilter.getValues(),
        addresseds: this.addressedFilter.getValues(), // RH: terrible name - but consistent
      };
    },

    exportToCsv: function(event) {
      event.preventDefault(); event.stopPropagation();
      document.location = '//' + this.config.app.host + '/api/party?weddingId=' + this.weddingId + '&download=1';
    }
  });

  return View;
});
