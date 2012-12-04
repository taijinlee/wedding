define([
  'jquery',
  'underscore',
  'backbone',
  'models/checkin'
], function($, _, Backbone, CheckinModel) {

  var CheckinButtonView = Backbone.View.extend({
    tagName: 'button',
    attributes: {
      'class': 'btn'
    },
    events: {
      'click': 'checkin'
    },

    initialize: function(vent, pather, cookie) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function(drink) {
      this.drink = drink;
      this.$el.html('Check In');
      return this;
    },

    checkin: function() {
      var checkin = new CheckinModel({ drinkId: this.drink.get('id'), userId: this.cookie.get('userId') });
      checkin.save({
        success: function(response) {
          console.log("success");
        },
        error: function(error) {
          console.log("fail");
          console.log(error);
        }
      });
      return false;
    }

  });

  return CheckinButtonView;

});
