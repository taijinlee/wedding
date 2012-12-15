define([
  'jquery',
  'underscore',
  'backbone',
  'models/guest',
  'text!./new.html',
  'text!./addFormRow.html'
], function($, _, Backbone, GuestModel, addFormTemplate, addFormRowTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click #addSubmit': 'createGuest'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0];

      this.display = {
        firstName: 'First Name',
        lastName: 'Last Name',
        address1: 'Address',
        city: 'City',
        state: 'State',
        zip: 'Zip',
        email: 'Email'
      };
    },

    render: function() {
      this.$el.html(_.template(addFormTemplate));
      var $formSection = this.$el.find('#add-form');
      _.each(this.display, function(displayName, key) {
        $formSection.append(_.template(addFormRowTemplate, { displayName: displayName, key: key, value: null }));
      });
      return this;
    },

    createGuest: function(event) {
      var values = { weddingId: this.weddingId };
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      var self = this;
      var guest = new GuestModel(values);
      console.log(guest.validate(values));
      if (!guest.isValid()) {
        this.vent.trigger('renderNotification', 'blah', 'error');
        return false;
      }

      guest.save({}, {
        error: function(model, response) {
          self.vent.trigger('renderNotification', 'Error', 'error');
          console.log(model);
          console.log(response);
        },
        success: function(model, response) {
          console.log(model);
          console.log(response);
          console.log(self.vent);
          // this.vent.trigger('renderNotification', 'An email has been sent to you', 'success');
        }
      });
      return false;
    }

  });

  return View;

});
