define([
  'jquery',
  'underscore',
  'backbone',
  'models/drinkList',
  'models/drinkListItem',
  'collections/drinkListItems'
], function($, _, Backbone, DrinkListModel, DrinkListItemModel, DrinkListItemsCollection) {

  var View = Backbone.View.extend({
    tagName: 'section',
    events: {
      'click .delete': 'deleteDrink'
    },

    initialize: function(vent, pather, cookie, drinkList) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.drinkList = drinkList;

      this.drinkListItems = new DrinkListItemsCollection();
      this.drinkListItems.on('reset', this.renderList, this);
    },

    render: function() {
      this.$el.append(this.make('h2', { 'class': 'name' }, this.drinkList.get('name')));

      this.$listEl = $(this.make('ul', { 'class': 'unstyled' }));
      this.$el.append(this.$listEl);

      this.drinkListItems.fetch({
        data: { drinkListId: this.drinkList.get('id') }
      });
      return this;
    },

    renderList: function() {
      this.drinkListItems.each(function(listItem) {
        var deleteButton = this.make('button', { 'class': 'delete', 'data-listItemId': listItem.get('id') }, 'X');
        var $listItemEl = $(this.make('li', {}, listItem.get('drink').name));
        $listItemEl.append(deleteButton);
        this.$listEl.append($listItemEl);
      }, this);
      return this;
    },

    deleteDrink: function(event) {
      console.log(event);
      var $listItem = $(event.currentTarget);
      var drinkListItem = new DrinkListItemModel({ id: $listItem.attr('data-listItemId') });
      drinkListItem.destroy({
        success: function() {
        },
        error: function(error) {
          // console.log(error);
        }
      });
      $listItem.closest('li').remove();
    }

  });

  return View;

});
