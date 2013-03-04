var config = {
  baseUrl: '/VERSION/js',

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
    'text': 'lib/require/text',
    'types': 'lib/backbone/types',
    'underscore': 'lib/underscore/underscore',
    'validator': 'lib/validator/validator-edited'
  },
  shim: {
    'autocomplete': ['jquery'],
    'bootstrap': ['jquery'],
    'bootstrap-editable': ['jquery', 'bootstrap'],
    'bootstrap-timepicker': ['jquery', 'bootstrap'],
    'datepicker': ['jquery'],
    'json': ['text'],
    'select2': ['jquery']
  }
};
require.config(config);

require([
  'common',
], function(common) {
  require(['init']);
});
