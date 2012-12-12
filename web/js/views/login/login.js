define([
  'jquery',
  'underscore',
  'backbone',
  'models/auth',
  'text!./form.html'
], function($, _, Backbone, AuthModel, formTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click #loginButton': 'login'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.html(_.template(formTemplate));
      return this;
    },

    login: function() {
      var values = { type: 'base' };
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      var auth = new AuthModel(values);
      if (!auth.isValid()) {
        this.vent.trigger('renderNotification');
        return false;
      }

      auth.save({}, {
        error: function(model, response) {
          self.vent.trigger('renderNotification', 'Error', 'error');
          console.log(model);
          console.log(response);
        },
        success: function(model, response) {
          Backbone.history.navigate('organization', true);
        }
      });

      return false;
    }


  });

  return View;

});
