module.exports = function() {

  var config = require('config');

  config.makeHidden(config.app, 'port');
  config.makeHidden(config, 'store');

  return config;

};
