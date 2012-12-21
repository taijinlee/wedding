
require.config({
  paths: {
    'async': 'lib/async/async',
    'backbone': 'lib/backbone/backbone-amd',
    'backbone-web': 'lib/backbone/backbone-web',
    'humanize': 'lib/humanize',
    'json2': 'lib/json2',
    'jquery': 'lib/jquery/jquery-min',
    'order': 'lib/require/order-min',
    'select2': 'lib/select2.min',
    'text': 'lib/require/text',
    'types': 'lib/backbone/types',
    'underscore': 'lib/underscore/underscore',
    'validator': 'lib/validator/validator-min'
  },
  baseUrl: '/js',
  priority: ['common']
});

require([
  'jquery',
  'backbone',
  'models/config',
  'router'
], function($, Backbone, ConfigModel, Router) {
  new ConfigModel().fetch({
    success: function(configModel, configObj) {
      var router = new Router(configObj.data);
    }
  });

  // set a globally delegated event for a tags.
  // when clicked, we'll use backbone navigate unless ctrl, meta key were held, or if it was not left click
  $('body').on('click', 'a', function(event) {
    if (event.which === 1 && !event.ctrlKey && !event.metaKey) {
      var location = $(event.currentTarget).attr('href');
      // slight hack. Ignore if href is a javascript action, which will allow it to execute
      if (location.indexOf('javascript') === 0) { return; }
      if (location.indexOf('http') !== -1) { return; }

      event.preventDefault();
      event.stopPropagation();

      Backbone.history.navigate(location, { trigger: true });
    }
  });

});
