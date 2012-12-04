define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function(profileType, imgSrc, caption, profileUrl) {
      this.$el.addClass(profileType).addClass('profilePicture');

      var image = this.make('img', { 'class': 'thumbnail', src: imgSrc });
      // wrap it in a link if we have a url
      if (profileUrl) {
        image = this.make('a', { href: profileUrl }, image);
      }
      this.$el.append(image);

      if (caption !== undefined && caption.trim().length) {
        this.$el.append(this.make('aside', { 'class': 'cpation' }, caption));
      }

      return this;
    }

  });
  return View;

});
