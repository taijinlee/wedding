define([
  'jquery',
  'underscore',
  'backbone',
  'models/wedding'
], function($, _, Backbone, WeddingModel) {

  return Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.wedding = new WeddingModel();
      this.wedding.on('change', this.redirect, this);
    },

    render: function() {
      var self = this;
      this.wedding.fetch({
        data: {
          userId: this.cookie.get('userId')
        },
        success: function() {
          Backbone.history.navigate(self.pather.getUrl('guestlist', { weddingId: self.wedding.get('id') }), { trigger: true });
        },
        error: function() {
          Backbone.history.navigate(self.pather.getUrl('homepage'), { trigger: true });
        }
      });
    },

    redirect: function() {
    }
  });
});
