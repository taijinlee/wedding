define([
  'jquery',
  'underscore',
  'backbone',
  'text!../categorySelector.html'
], function($, _, Backbone, categoryTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click .categoryChoice': 'setPartyCategory'
    },

    initialize: function(config, vent, pather, cookie, party) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.party = party;
    },

    render: function() {
      this.$el.html(_.template(categoryTemplate, { selectedCategory: this.party.get('category'),
                                                   partyId : this.party.get('id')}));
      return this;
    },

    setPartyCategory: function(event) {
      event.preventDefault(); event.stopPropagation();
      var category = $(event.target).val();
      if (category === this.party.get('category')) {
        category = 'none';
      }
      this.party.set({ category: category }).save();
      this.vent.trigger('guestList:categoryUpdate');
    }

  });

  return View;

});
