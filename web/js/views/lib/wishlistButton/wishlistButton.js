define([
  'jquery',
  'underscore',
  'backbone',
  'models/wishlistItem'
], function($, _, Backbone, WishlistItemModel) {

  var View = Backbone.View.extend({
    events: {
      'click #add': 'addToWishlist'
    },

    initialize: function(config, vent, pather, cookie) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function(drink) {
      // don't render
      if (!this.cookie.get('userId')) { return this; }

      this.drink = drink;
      var button = this.make('button', { 'class': 'btn', id: 'add' }, 'Add to Wishlist');
      this.$el.html(button);
      return this;
    },

    addToWishlist: function() {
      // don't do anything
      var userId = this.cookie.get('userId');
      if (!userId) { return null; }

      new WishlistItemModel({ userId: userId, drinkId: this.drink.get('id') }).save({
        success: function(response) {
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
