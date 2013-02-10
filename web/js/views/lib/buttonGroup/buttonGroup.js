define([
  'jquery',
  'underscore',
  'backbone',
  'text!./buttonGroup.html'
], function($, _, Backbone, buttonGroupTemplate) {
  return Backbone.View.extend({

    initialize: function(config, vent, pather, cookie) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    /**
     * show in order
     * [ { display: 'Display', value: 'value' }, .. ]
     */
    render: function(buttonConfig, initValues) {
      initValues = _.isArray(initValues) ? initValues : [initValues];
      this.$el.html(_.template(buttonGroupTemplate, { buttonConfig: buttonConfig, initValues: initValues }));
      return this;
    },

    getValues: function() {
      return this.$el.find('.btn-on').map(function(index, el) { return $(el).data('value'); }).toArray();
    }

  });

});
