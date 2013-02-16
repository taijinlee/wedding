define([
  'jquery',
  'underscore',
  'backbone',
  'text!../addressed.html'
], function($, _, Backbone, addressedTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click .checkbox': 'setAddressed'
    },

    initialize: function(config, vent, pather, cookie, party) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.party = party;
    },

    render: function() {
      var isAddressed = (this.party.get('isAddressed')) ? true : false;
      this.$el.html(_.template(addressedTemplate, { isAddressed: isAddressed }));
      return this;
    },

    setAddressed: function(event) {
      event.preventDefault(); event.stopPropagation();
      var $addressedCheckBox = $(event.target);
      var addressed = false;

      if ($addressedCheckBox.prop('checked')) {
        addressed = true;
      }
      this.party.set({ isAddressed: addressed }).save({}, {
        success: function() {
        }
      });

      this.vent.trigger('guestList:addressedUpdate');
    }

  });

  return View;

});
