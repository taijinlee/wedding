define([
  'jquery',
  'underscore',
  'backbone',
  'models/event',
  'text!./input.html'
], function($, _, Backbone, EventModel, inputTemplate) {

  return Backbone.View.extend({

    events: {
      'submit form': 'createEvent'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.html(inputTemplate);
      $('#date').editable({
        type: 'date',
        viewformat: 'mm/dd/yyyy',
      });
      $('#people').select2({ tags:['bride', 'groom', 'bridesmaids', 'groomsmen', 'photographer', 'DJ', 'caterer', 'videographer'] });
    },

    createEvent: function(event) {
      event.preventDefault(); event.stopPropagation();
      var values = {};
      console.log(this.$('form'));
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      




      console.log(values);

      console.log('hi');
    }



  });

});
