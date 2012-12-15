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

      var self = this;
      auth.on('error', function(model, response, options) {
        self.vent.trigger('renderNotification', 'Error', 'error');
      });
      auth.on('sync', function(model, response, options) {
        Backbone.history.navigate(self.pather.getUrl('weddingsList'), true);
      });
      auth.save();

      return false;
    }


  });

  return View;

});
