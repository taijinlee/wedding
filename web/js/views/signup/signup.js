define([
  'jquery',
  'underscore',
  'backbone',
  'models/signup',
  'text!./form.html'
], function($, _, Backbone, SignupModel, formTemplate) {

  var SignupView = Backbone.View.extend({
    events: {
      'click #signupButton': 'signup'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.html(_.template(formTemplate));
      return this;
    },

    signup: function(event) {
      event.preventDefault; event.stopPropagation();
      var values = {};
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      var self = this;
      new SignupModel().save(values, {
        error: function(model, response) {
          self.$el.find('.help-inline').remove();
          self.$el.find('.control-group').removeClass('error');
          var errors = model.validate(values);
          _.each(errors, function(errorInfo) {
            var $input = self.$el.find('#' + errorInfo.column);
            $input.closest('.control-group').addClass('error');
            $input.after(self.make('span', { 'class': 'help-inline' }, 'Required' ));
          });
          // self.vent.trigger('renderNotification', 'Error', 'error');
        },
        success: function(model, response) {
          self.vent.trigger('renderNotification', 'You have successfully registered! Please log in.', 'success');
        }
      });
      return false;
    }


  });

  return SignupView;

});
