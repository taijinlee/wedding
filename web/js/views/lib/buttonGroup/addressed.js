define([
  'jquery',
  'underscore',
  'backbone',
  './buttonGroup'
], function($, _, Backbone, ButtonGroupView) {

  return ButtonGroupView.extend({
    buttonConfig: [
      { value: true, display: 'Addressed'},
      { value: false, display: 'Unaddressed'},
    ],

    render: function(displayNone, initValues) {
      var buttonConfig = (displayNone === true) ? this.buttonConfig : _.initial(this.buttonConfig);
      return ButtonGroupView.prototype.render.apply(this, [buttonConfig, initValues]);
    }

  });

});
