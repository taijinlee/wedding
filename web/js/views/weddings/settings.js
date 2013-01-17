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
    },

    render: function() {
      var backUrl = this.pather.getUrl('weddingsList');
      this.$el.html(_.template(settingsFormTemplate, { wedding: this.wedding, backUrl: backUrl }));
      $(this.$el.find('#weddingDate')).datepicker();
      this.$el.find('#weddingLocation').html(_.template(addressFormTemplate, {address: this.wedding.get('address'), showButtons: false }));
      return this;
    },

    saveSettings: function(event) {
      event.preventDefault(); event.stopPropagation();
      
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });
      
      var self = this;
      this.wedding.save(values, {
        error: function(model, response) {
          self.vent.trigger('renderNotification', 'Error', 'error');
          Console.Log(Model);
          Console.log(response);
        },
        success: function(model, response) {
          Backbone.history.navigate(self.pather.getUrl('guestlist', { weddingId: self.weddingId }), { trigger: true });
          console.log(model);
          console.log(response);
          console.log(self.vent);
          // this.vent.trigger('renderNotification', 'An email has been sent to you', 'success');
        },
        // weird ass shit going on here... partyData.guests gets corrupted when save goes. console.log is async?
        silent: true
      });

      return false;
    }

  });

  return View;

});
