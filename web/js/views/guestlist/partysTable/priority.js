define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/buttonGroup/priority'
], function($, _, Backbone, PriorityButtonsView) {

  var View = Backbone.View.extend({
    events: {
      'click button': 'setPartyPriority'
    },

    initialize: function(config, vent, pather, cookie, party) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.party = party;
      this.partyButtons = new PriorityButtonsView();
    },

    render: function() {
      this.partyButtons.setElement(this.$el).render(false, this.party.get('priority'));
      return this;
    },

    setPartyPriority: function(event) {
      event.preventDefault(); event.stopPropagation();
      var $priorityButton = $(event.target);

      var priority = 'none';
      if (!$priorityButton.hasClass('btn-on')) {
        priority = $priorityButton.data('value'); // only need button priority if we're switching to on
      }

      this.party.save({ priority: priority }, {
        success: function() {
          if (priority === 'none') {
            $priorityButton.removeClass('btn-on');
          } else {
            $priorityButton.siblings().removeClass('btn-on');
            $priorityButton.addClass('btn-on');
          }
        }
      });

      this.vent.trigger('guestList:priorityUpdate');
    }

  });

  return View;

});
