define([
  'jquery',
  'underscore',
  'backbone',
  'models/rating'
], function($, _, Backbone, RatingModel) {

  var View = Backbone.View.extend({
    events: {
      'click li': 'rate'
    },

    initialize: function(config, vent, pather, cookie) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function(drink) {
      // don't render
      if (!this.cookie.get('userId')) { return this; }

      this.drink = drink;
      var $ul = $(this.make('ul', { 'class': 'unstyled horizontalList' }));

      for (var i = 1; i <= 5; i++) {
        $ul.append(this.make('li', { 'class': 'rating', 'data-rating': i }, '*'));
      }
      this.$el.html($ul);
      return this;
    },

    rate: function(event) {
      var ratingValue = $(event.currentTarget).attr('data-rating');
      var rating = new RatingModel({ drinkId: this.drink.get('id'), rating: ratingValue, userId: this.cookie.get('userId') });
      rating.save({
        success:function(response) {
          console.log('success');
        },
        error: function(error) {
          console.log('fail');
          console.log(error);
        }
      });
      return false;
    }

  });

  return View;

});
