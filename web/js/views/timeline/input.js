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
      $('#date').datepicker();
      $('#time').timepicker({
        minuteStep: 5
      });
      $('#people').select2({ tags:['bride', 'groom', 'bridesmaids', 'groomsmen', 'photographer', 'DJ', 'caterer', 'videographer'] });
    },

    createEvent: function(event) {
      event.preventDefault(); event.stopPropagation();
      var values = {};
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      var date = values.date.split('/');

      // year, month, day, hours, minutes, seconds, milliseconds
      var d = new Date(parseInt(date[2], 10), parseInt(date[0], 10) - 1, parseInt(date[1], 10), parseInt(values.hour, 10) + (values.meridian === 'PM' ? 12 : 0), parseInt(values.minute, 10));

      var event = new EventModel();
      var self = this;
      event.save({
        name: values.name,
        time: d.getTime(),
        people: values.people.split(','),
        location: values.location
      }, {
        success: function(event) {
          self.vent.trigger('timelineInput:addEvent', event);
        }
      });

    }



  });

});
