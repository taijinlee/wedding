define([
  'jquery',
  'backbone',
  'models/config',
  'router'
], function($, Backbone, ConfigModel, Router) {

  new ConfigModel().fetch({
    success: function(configModel, configObj) {
      window.socket = window.io.connect('http://' + configObj.data.app.host);
      var router = new Router(configObj.data);
    }
  });

  // set a globally delegated event for a tags.
  // when clicked, we'll use backbone navigate unless ctrl, meta key were held, or if it was not left click
  $('body').on('click', 'a', function(event) {
    if (event.which === 1 && !event.ctrlKey && !event.metaKey) {
      var location = $(event.currentTarget).attr('href');
      // slight hack. Ignore if href is a javascript action, which will allow it to execute
      if (location.indexOf('#') === 0) { return; }
      if (location.indexOf('javascript') === 0) { return; }
      if (location.indexOf('http') !== -1) { return; }

      event.preventDefault();
      event.stopPropagation();

      Backbone.history.navigate(location, { trigger: true });
    }
  });

});
