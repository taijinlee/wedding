define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/detailPanes/drinkList',
  'collections/drinkLists'
], function($, _, Backbone, DrinkListDetailPane, DrinkListsCollection) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.drinkLists = new DrinkListsCollection();
      this.drinkLists.on('reset', this.renderDrinkLists, this);
    },

    render: function() {
      this.drinkListsEl = $(this.make('ul', { 'class': 'unstyled span12' }));
      this.$el.html(this.drinkListsEl);

      this.drinkLists.fetch({
        data: { userId: this.cookie.get('userId') }
      });
      return this;
    },

    renderDrinkLists: function() {
      this.drinkLists.each(function(drinkList) {
        var detailPane = new DrinkListDetailPane(this.vent, this.pather, this.cookie, drinkList).render().$el;
        this.drinkListsEl.append(this.make('li', { 'class': '' }, detailPane.addClass('span8 offset3')));
      }, this);
      this.loading = false;
    }

  });

  return View;

});
