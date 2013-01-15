define([
  'jquery',
  'underscore',
  'backbone',
  'text!./category.html'
], function($, _, Backbone, categoryTemplate) {

  var View = Backbone.View.extend({
    events: {
      'change .partyCategory': 'setPartyCategory'
    },

    initialize: function(config, vent, pather, cookie, party) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.party = party;
    },

    render: function() {
      var categoriesList = { bride: "Bride", groom: "Groom" };
      this.$el.html(_.template(categoryTemplate, { category: this.party.get('category'), categories: categoriesList, party: this.party}));
      return this;
    },

    setPartyCategory: function(event) {
      event.preventDefault(); event.stopPropagation();
      var category = $(event.target).val();
      this.party.set({ category: category }).save();
      this.vent.trigger('guestList:categoryUpdate');
    }

  });

  return View;

});
