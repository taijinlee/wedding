module.exports = function() {

  var config = require('config');

  config.makeHidden(config.app, 'port');
  config.makeHidden(config, 'store');

  config.makeHidden(config, 'aws');

  return config;
};
