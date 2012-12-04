define([
  'jquery',
  'underscore',
  'backbone',
  'text!./stat.html'
], function($, _, Backbone, statTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
    },

    /**
     * stats in format
     * [ {key: key, value: value}, ... ] from top downwards
     */
    render: function(stats) {
      var $dl = $(this.make('dl', { 'class': 'statsPane' }));

      _.each(stats, function(stat) {
        $dl.append(_.template(statTemplate, stat));
      }, this);
      this.$el.html($dl);
      return this;
    }
  });

  return View;

});
