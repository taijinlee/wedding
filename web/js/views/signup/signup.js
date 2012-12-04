define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'text!./form.html'
], function($, _, Backbone, UserModel, formTemplate) {

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
      this.$('input').each(function() {
        values[this.name] = $(this).val();
      });

      var self = this;
      var user = new UserModel();
      user.save(values, {
        error: function(model, response) {
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
