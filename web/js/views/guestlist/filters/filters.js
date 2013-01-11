define([
  'jquery',
  'underscore',
  'backbone',
  'text!./filters.html',
  'text!../priorityButtons.html'
], function($, _, Backbone, filtersTemplate, priorityButtonsTemplate) {
  var View = Backbone.View.extend({
    events: {
      'click #party-priority-filter button': 'setPriorityFilter',
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.html(_.template(filtersTemplate));
      this.$el.find('#party-priority-filter').html(_.template(priorityButtonsTemplate, { priority: '' }));
    },

    setPriorityFilter: function(event) {
      event.preventDefault(); event.stopPropagation();
      var $selectedPriority = $(event.target);
      $selectedPriority.toggleClass('btn-on');
      this.vent.trigger('guestList:filterUpdate', this.getFilterValues());
    },

    getFilterValues: function() {
      var priorities = this.$el.find('#party-priority-filter .btn-group').children().filter('.btn-on').map(function(index, el) { return $(el).data('priority'); }).toArray();
      return {
        priorities: priorities
      };
    }
  });

  return View;
});
