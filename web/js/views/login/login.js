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
      event && event.preventDefault && event.stopPropagation();
      var values = { type: 'base' };
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      var authBase = new AuthBaseModel(values);
      var errors = authBase.validate(values);
      if (errors) {
        _.each(errors, function(error) {
          $('#' + error.column).addClass('error');
        });
        this.vent.trigger('renderNotification', 'Error', 'error');
        return false;
      }

      var self = this;
      authBase.on('error', function(model, response, options) {
        self.vent.trigger('renderNotification', 'Error', 'error');
      });
      authBase.on('sync', function(model, response, options) {
        Backbone.history.navigate(self.pather.getUrl('weddingsList'), true);
      });
      authBase.save();

      return false;
    }


  });

  return View;

});
