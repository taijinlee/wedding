define([
  'jquery',
  'underscore',
  'backbone',
  'text!views/lib/summaryTile/summaryTile.html'
], function($, _, Backbone, summaryTileTemplate) {

  var SummaryTileView = Backbone.View.extend({

    tagName: 'div',

    initialize: function(options) {
      if (options !== undefined) {
        this.subject = options.subject;
        this.summary = options.summary;
        this.id = options.id;
      }
    },

    render: function(options) {
      if (options === undefined) {
	$(this.el).html(_.template(summaryTileTemplate,{'subject': this.subject, 'subjectId': this.id, 'subjectSummary' : this.summary}));
      } else {
        $(this.el).html(_.template(summaryTileTemplate,{'subject': options.subject, 'subjectId': options.id, 'subjectSummary' : options.summary}));
      }
      return this;
    }

  });
  return SummaryTileView;

});
