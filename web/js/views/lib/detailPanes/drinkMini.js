define([
  'jquery',
  'underscore',
  'backbone',
  'humanize',
  'models/drink',
  'models/checkin',
  'views/lib/profilePicture/profilePicture',
  'views/lib/statsPane/statsPane',
  'text!./drinkMini.html'
], function($, _, Backbone, humanize, DrinkModel, CheckinModel, ProfilePictureView, StatsPaneView, drinkMiniTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, drink) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.drink = drink;
      this.profilePicture = new ProfilePictureView(config, vent, pather, cookie);
      this.stats = new StatsPaneView(vent, pather, cookie);
    },

    render: function() {
      this.$el.html(_.template(drinkMiniTemplate));

      var drinkUrl = this.pather.getUrl('drink', { id: this.drink.get('id') });
      this.profilePicture.setElement(this.$('#drinkMini-profilePicture')).render('drink', 'http://www.bevmo.com/Media/Images/ProductImagesFull/58820.jpg', '' /* caption */, drinkUrl);

      this.$('#drinkMini-url').attr('href', drinkUrl);
      this.$('#drinkMini-name').html(this.drink.get('name'));

      var stats = [
        { key: 'ABV', value: '10.3%' },
        { key: 'Vintage', value: '2009' },
        { key: 'abcdefghijklmnopqrstuv', value: '12345678901234567890' },
      ];

      this.stats.setElement(this.$('#drinkMini-stats')).render(stats);
      return this;
    }

  });

  return View;

});
