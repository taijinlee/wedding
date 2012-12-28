define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/statsPane/statsPane'
], function($, _, Backbone, StatsPaneView) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.statsPane = new StatsPaneView();
    },

    render: function(partys) {
      var defaultMemo = {
        total: { display: 'Total', value: 0 },
        a: { display: 'A', value: 0 },
        b: { display: 'B', value: 0 },
        c: { display: 'C', value: 0 },
        noPriority: { display: 'None', value: 0 }
      };
      var priorityCounts = _.chain(partys).map(function(party) {
        return party.priority;
      }).reduce(function(memo, priority) {
        if (priority) {
          memo[priority].value += 1;
        } else {
          memo.noPriority.value += 1;
        }
        memo.total.value += 1;
        return memo;
      }, defaultMemo).value();
      this.statsPane.setElement(this.$el).render(priorityCounts, 'Guest counts');
    }

  });

  return View;

});