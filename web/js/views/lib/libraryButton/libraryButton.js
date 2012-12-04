define([
  'jquery',
  'underscore',
  'backbone',
  'models/libraryItem'
], function($, _, Backbone, LibraryItemModel) {

  var View = Backbone.View.extend({
    events: {
      'click #add': 'addToLibrary'
    },

    initialize: function(config, vent, pather, cookie) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function(drink) {
      // don't render
      if (!this.cookie.get('userId')) { return null; }
      this.drink = drink;

      var button = this.make('button', { 'class': 'btn', id: 'add' }, 'Add to Library');
      this.$el.html(button);
      return this;
    },

    addToLibrary: function() {
      // don't do anything
      var userId = this.cookie.get('userId');
      if (!userId) { return null; }
      var libraryItem = new LibraryItemModel({ userId: userId, drinkId: this.drink.get('id') });
      libraryItem.save({
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
