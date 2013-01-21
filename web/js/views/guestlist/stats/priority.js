define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/statsPane/statsPane'
], function($, _, Backbone, StatsPaneView) {

  var View = Backbone.View.extend({

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.vent.on('statsCalculated', this.renderCategories, this);

      this.display = [
        { key: 'a', display: 'A' },
        { key: 'b', display: 'B' },
        { key: 'c', display: 'C' },
        { key: 'none', display: 'None' }
      ];
      this.statsPane = new StatsPaneView(this.config, this.vent, this.pather, this.cookie, args);
    },

    renderCategories: function(allStats) {
      var priorityStats = allStats.priorities;
      var statsDisplay = _.map(this.display, function(displayConfig) {
        return { display: displayConfig.display, value: (priorityStats[displayConfig.key] || 0) };
      });
      this.statsPane.setElement(this.$el).render(statsDisplay, '');
    }

  });

  return View;

});
