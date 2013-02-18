define([
  'jquery',
  'underscore',
  'backbone',
  'text!./priorityDropdown.html'
], function($, _, Backbone, priorityDropdownTemplate) {

  var View = Backbone.View.extend({
    events: {
      'change #priorityDropdown': 'setPartyPriority'
    },

    initialize: function(config, vent, pather, cookie, party) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.party = party;
    },

    render: function() {
      this.$el.html(_.template(priorityDropdownTemplate, { priority: this.party.get('priority') }));
      return this;
    },

    setPartyPriority: function(event) {
      event.preventDefault(); event.stopPropagation();
      var priority = $(event.target).val();

      this.party.save({ priority: priority });
      this.vent.trigger('guestList:priorityUpdate');
    }

  });

  return View;

});
