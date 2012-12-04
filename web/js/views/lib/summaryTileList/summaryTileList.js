define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/summaryTile/summaryTile'
], function($, _, Backbone, SummaryTileView) {

  var SummaryTileListView = Backbone.View.extend({

    tagName: 'div',

    initialize: function(options) {
      if (options !== undefined) {
        this.summaries = options.summaries; // assuming an array of objs with subject, summary, id
      }
    },

    render: function(options) {
      if (options !== undefined) {
        this.summaries = options;
      }
      for (var i = 0; i < this.summaries.length; i++) {
        $(this.el).append(new SummaryTileView(this.summaries[i]).render().el);
      }
      return this;
    }

  });
  
  return SummaryTileListView;

});