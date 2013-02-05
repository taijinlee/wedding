
if (process.env.APP_ROOT === undefined) { throw new Error('APP_ROOT not set. Try ~/wedding or /service/wedding'); }

var express = require('express');
var config = require(process.env.APP_ROOT + '/config/config.js')();
var logger = require(process.env.APP_ROOT + '/lib/logger.js')();
var app = express();

// overwriting default date token definition
express.logger.token('date', function() { return Date().replace(/GMT-\d{4} /, ''); });

app.configure(function() {
  app.use(express.compress());
  app.use(express.bodyParser({ uploadDir: process.env.APP_ROOT + '/tmp' }));
  app.use(express.cookieParser());
  // use this as _method = POST / PUT / DELETE in forms to emulate them without going through backbone
  app.use(express.methodOverride());
});

// services
var datastore = 'mongo';
var store = require(process.env.APP_ROOT + '/store/store.js')(datastore, config.store.mongo);
var history = require(process.env.APP_ROOT + '/history/history.js')(store);
var SplashSubscribeModel = require(process.env.APP_ROOT + '/models/splashSubscribe.js')(store);

// load config based on environment
// specific to development
process.env.WEB_ROOT = '/splash/web';

app.use(express.logger(logger.serverLogFormatDev()));
app.use(express['static'](process.env.APP_ROOT + process.env.WEB_ROOT));

app.post('/subscribe', function(req, res, next) {
  res.locals.responder = require(process.env.APP_ROOT + '/lib/responder.js')();
  res.locals.responder.initialize(res);
  if (!req.body.email) { return res.locals.responder.send(new Error('No email')); }
  var subscribe = new SplashSubscribeModel({ email: req.body.email });
  if (!subscribe.isValid()) { return res.locals.responder.send(new Error('Invalid email')); }

  subscribe.create(res.locals.responder.send);
});

app.use(function(error, req, res, next) { res.locals.responder.send(error); });

// start listening
app.listen(config.app.port);
logger.log({ message: 'server start', port: config.app.port });
