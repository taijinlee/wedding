define([
  'jquery',
  'underscore',
  'backbone',
  'models/signup',
  'text!./form.html'
], function($, _, Backbone, SignupModel, formTemplate) {

  var SignupView = Backbone.View.extend({
    events: {
      'click #signup_button': 'signup'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.html(_.template(formTemplate));
      return this;
    },

    signup: function() {
      var values = {};
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      var self = this;
      var signup = new SignupModel(values);
      if (!signup.isValid()) {
        this.vent.trigger('renderNotification');
      }

      signup.save({}, {
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

  return SignupView;

});
