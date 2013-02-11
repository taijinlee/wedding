define([
  'jquery',
  'underscore',
  'backbone',
  'text!./addressed.html'
], function($, _, Backbone, addressedTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click .addressedSelector': 'setAddressed'
    },

    initialize: function(config, vent, pather, cookie, party) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.party = party;
    },

    render: function() {
      var isAddressed = (this.party.get('isAddressed')) ? 'y' : 'n';
      this.$el.html(_.template(addressedTemplate, { isAddressed: isAddressed }));
      return this;
    },

    setAddressed: function(event) {
      event.preventDefault(); event.stopPropagation();
      var $addressedButton = $(event.target);

      var addressed = false;
      if (!$addressedButton.hasClass('btn-on')) {
        addressed = ($addressedButton.data('addressed') === 'y') ? true : false; // only need button priority if we're switching to on
      }
      this.party.set({ isAddressed: addressed }).save({}, {
        success: function() {
          $addressedButton.siblings().removeClass('btn-on');
          $addressedButton.addClass('btn-on');
        }
      });

      this.vent.trigger('guestList:addressedUpdate');
    }

  });

  return View;

});
