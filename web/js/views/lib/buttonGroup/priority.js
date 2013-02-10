define([
  'jquery',
  'underscore',
  'backbone',
  './buttonGroup'
], function($, _, Backbone, ButtonGroupView) {

  return ButtonGroupView.extend({
    buttonConfig: [
      { value: 'a', display: 'A'},
      { value: 'b', display: 'B'},
      { value: 'c', display: 'C' },
      { value: 'none', display: 'None' }
    ],

    render: function(displayNone, initValues) {
      var buttonConfig = (displayNone === true) ? this.buttonConfig : _.initial(this.buttonConfig);
      return ButtonGroupView.prototype.render.apply(this, [buttonConfig, initValues]);
    }

  });

});
