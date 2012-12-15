define([
  'jquery',
  'underscore',
  'backbone',
  'models/weddingCreate',
  'text!./new.html',
  'text!./addFormRow.html'
], function($, _, Backbone, WeddingCreateModel, addFormTemplate, addFormRowTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click #addSubmit': 'createFiance'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.display = {
        fianceFirstName: 'Fiance First Name',
        fianceLastName: 'Fiance Last Name'
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

    createFiance: function(event) {
      var values = {};
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      var self = this;
      var weddingCreate = new WeddingCreateModel(values);
      if (!weddingCreate.isValid()) {
        this.vent.trigger('renderNotification', 'blah', 'error');
        return false;
      }

      weddingCreate.save({}, {
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
