define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/buttonGroup/buttonGroup'
], function($, _, Backbone, ButtonGroupView) {
  var View = Backbone.View.extend({
    events: {
      'click #party-priority-filter button': 'setPriorityFilter',
      'change #party-category-filter' : 'setCategoryFilter',
      'click #filter-export button': 'exportToCsv'
    },

    initialize: function(config, vent, pather, cookie, weddingId) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = weddingId;
    },

    render: function() {
      this.$el.html(_.template(filtersTemplate));
      this.$el.find('#party-priority-filter').html(_.template(priorityButtonsTemplate, { priority: '' }));
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
      var priorities = this.$el.find('#party-priority-filter .btn-group').children().filter('.btn-on').map(function(index, el) { return $(el).data('priority'); }).toArray();
      var category = this.$el.find('#party-category-filter .categorySelect').val();
      return {
        priorities: priorities,
        category : category
      };
    },

    exportToCsv: function(event) {
      event.preventDefault(); event.stopPropagation();
      document.location = '//' + this.config.app.host + '/api/party?weddingId=' + this.weddingId + '&download=1';
    }
  });

  return View;
});
