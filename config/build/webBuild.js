var requirejs = require('requirejs');
var fs = require('fs');
var _ = require('underscore');
var exec = require('child_process').exec;

var config = {
  appDir: process.env.APP_ROOT + '/web',
  baseUrl: 'js',
  dir: process.env.APP_ROOT + '/web-build',
  // optimize: 'none',

  paths: {
    'async': 'lib/async/async',
    'autocomplete': 'lib/jquery/jquery.autocomplete',
    'backbone': 'lib/backbone/backbone-amd',
    'backbone-web': 'lib/backbone/backbone-web',
    'bootstrap': 'lib/bootstrap/bootstrap',
    'bootstrap-editable': 'lib/bootstrap-editable/bootstrap-editable',
    'bootstrap-timepicker': 'lib/bootstrap-timepicker/bootstrap-timepicker',
    'datepicker': 'lib/datepicker/bootstrap-datepicker',
    'humanize': 'lib/humanize',
    'moment': 'lib/moment',
    'json2': 'lib/json2',
    'jquery': 'lib/jquery/jquery-1.8.3',
    'select2': 'lib/jquery/select2',
    'socket.io': 'lib/socket.io',
    'text': 'lib/require/text',
    'types': 'lib/backbone/types',
    'underscore': 'lib/underscore/underscore',
    'validator': 'lib/validator/validator-edited'
  },

  modules: [
    { name: 'common' },
    { name: 'init', exclude: ['common'] }
  ]
};

var routes = JSON.parse(fs.readFileSync(process.env.APP_ROOT + '/web/js/routes.json')).routes;
_.each(routes, function(route) {
  var currModuleName = 'views/' + route.view;
  var isDefined = _.find(config.modules, function(module) {
    return module.name === currModuleName;
  });
  if (isDefined) { return; }
  config.modules.push({
    name: currModuleName,
    exclude: ['common']
  });
});

exec('git rev-parse --verify HEAD', function(error, stdout, stderror) {
  if (error) { return console.log(error); }

  var latestHash = stdout.trim();
  config.dir += '/' + latestHash;

  requirejs.optimize(config, function (buildResponse) {
    console.log(buildResponse);
    var versionedFiles = [config.dir + 'js/main.js', config.dir + 'layout.html'].join(' ');

    exec('find ' + versionedFiles + " -exec sed -i -e 's/VERSION/" + latestHash + "/g' {} \\;", function(error, stdout, stderror) {
      if (error) { return console.log(error); }
      console.log(versionedFiles + ' have VERSION substituted with ' + latestHash);
    });
  });

});
