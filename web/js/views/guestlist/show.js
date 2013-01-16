define([
  'jquery',
  'underscore',
  'backbone',
  './filters/filters',
  './statsPane/statsPane',
  './partysTable/partysTable',
  'text!./show.html',
], function($, _, Backbone, FiltersView, StatsPaneView, PartysTableView, showTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0];

      this.statsPane = new StatsPaneView(config, vent, pather, cookie, args);
      this.filters = new FiltersView(config, vent, pather, cookie, this.weddingId);
      this.partysTable = new PartysTableView(config, vent, pather, cookie, this.weddingId);
    },

    render: function() {
      this.$el.html(_.template(showTemplate));
      this.statsPane.setElement(this.$el.find('#weddingStats')).render();
      this.filters.setElement(this.$el.find('#filters')).render();
      this.partysTable.setElement(this.$el.find('#guestList')).render();
      return this;
    }

  });

  return View;

});
