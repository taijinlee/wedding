define([
  'jquery',
  'underscore',
  'backbone',
  'models/authBase',
  'text!./form.html'
], function($, _, Backbone, AuthBaseModel, formTemplate) {

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

    login: function(event) {
      event.preventDefault; event.stopPropagation();
      var values = { type: 'base' };
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      var self = this;
      new AuthBaseModel().save(values, {
        success: function() {
          Backbone.history.navigate(self.pather.getUrl('weddingsList'), true);
        },
        error: function() {
          self.vent.trigger('renderNotification', 'Incorrect username or password.', 'error');
        }
      });

      return false;
    }


  });

  return View;

});
