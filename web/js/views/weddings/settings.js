define([
  'jquery',
  'underscore',
  'backbone',
  'models/wedding',
  'text!./settings.html',
  'text!../party/addressForm.html'
], function($, _, Backbone, WeddingModel, settingsFormTemplate, addressFormTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click #settingsSubmit': 'saveSettings'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0];
      this.wedding = new WeddingModel({ id: this.weddingId });

      this.wedding.on('change', this.renderWeddingSettings, this);
    },

    render: function() {
      this.wedding.fetch({ id: this.weddingId });
      return this;
    },

    renderWeddingSettings: function() {
      var backUrl = this.pather.getUrl('weddingsList');
      this.$el.html(_.template(settingsFormTemplate, { wedding: this.wedding, backUrl: backUrl }));
      $(this.$el.find('#date')).datepicker();
      this.$el.find('#weddingLocation').html(_.template(addressFormTemplate, {address: this.wedding.get('address'), showButtons: false }));
    },

    saveSettings: function(event) {
      event.preventDefault(); event.stopPropagation();
      var values = {};
      _.each(this.$('form').serializeArray(), function(field) {
        if (field.value) {
          values[field.name] = field.value;
        }
      });

      if (values['weddingName1'] || values['weddingName2']) {
        values['name'] = values['weddingName1'] + ' & ' + values['weddingName2'];
        delete values.weddingName1;
        delete values.weddingName2;
      }

      var self = this;

      this.wedding.save(values, {
        error: function(model, response) {
          self.vent.trigger('renderNotification', 'Error', 'error');
          console.log(model);
          console.log(response);
        },
        success: function(model, response) {
          Backbone.history.navigate(self.pather.getUrl('weddingsList'), { trigger: true });
          console.log(model);
          console.log(response);
          console.log(self.vent);
        },
        silent: true
      });

      return false;
    }
  });

  return View;

});
