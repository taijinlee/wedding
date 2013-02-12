define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/buttonGroup/priority',
  'text!./filters.html',
  'text!../categorySelector.html'
], function($, _, Backbone, PriorityButtonsView, filtersTemplate, categorySelectorTemplate) {
  var View = Backbone.View.extend({
    events: {
      'click #party-priority-filter button': 'setPriorityFilter',
      'change #party-category-filter' : 'setCategoryFilter',
      'click #filter-export button': 'exportToCsv'
    },

    initialize: function(config, vent, pather, cookie) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.priorityFilter = new PriorityButtonsView(config, vent, pather, cookie);
    },

    render: function(weddingId) {
      this.weddingId = weddingId;

      this.$el.html(_.template(filtersTemplate));
      this.priorityFilter.setElement(this.$el.find('#party-priority-filter')).render(true);
      this.$el.find('#party-category-filter').html(_.template(categorySelectorTemplate, { selectedCategory: '' }));
    },

    setPriorityFilter: function(event) {
      event.preventDefault(); event.stopPropagation();
      var $selectedPriority = $(event.target);
      $selectedPriority.toggleClass('btn-on');
      this.vent.trigger('guestList:filterUpdate', this.getFilterValues());
    },

    setCategoryFilter: function(event) {
      event.preventDefault(); event.stopPropagation();
      this.vent.trigger('guestList:filterUpdate', this.getFilterValues());
    },

    getFilterValues: function() {
      var category = this.$el.find('#party-category-filter .categorySelect').val();
      return {
        priorities: this.priorityFilter.getValues(),
        category: category
      };
    },

    exportToCsv: function(event) {
      event.preventDefault(); event.stopPropagation();
      document.location = '//' + this.config.app.host + '/api/party?weddingId=' + this.weddingId + '&download=1';
    }
  });

  return View;
});
