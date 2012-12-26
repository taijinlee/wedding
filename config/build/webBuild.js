var requirejs = require('requirejs');
var fs = require('fs');
var exec = require('child_process').exec;

var config = {
  appDir: process.env.APP_ROOT + '/web',
  baseUrl: 'js',
  dir: process.env.APP_ROOT + '/web-build',
  // optimize: 'none',

  paths: {
    'async': 'lib/async/async',
    'backbone': 'lib/backbone/backbone-amd',
    'backbone-web': 'lib/backbone/backbone-web',
    'humanize': 'lib/humanize',
    'json2': 'lib/json2',
    'jquery': 'lib/jquery/jquery-1.8.3',
    'select2': 'lib/jquery/select2',
    'text': 'lib/require/text',
    'types': 'lib/backbone/types',
    'underscore': 'lib/underscore/underscore',
    'validator': 'lib/validator/validator-min'
  },

  modules: [
    { name: 'common' }
  ]
};

exec('git rev-parse --verify HEAD', function(error, stdout, stderror) {
  if (error) { return console.log(error); }

  var latestHash = stdout.trim();
  config.dir += '/' + latestHash;

  requirejs.optimize(config, function (buildResponse) {
    console.log(buildResponse);
  });

});
