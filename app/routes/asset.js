
module.exports = function(app, middlewares, handlers) {

  var fs = require('fs');

  app.post('/api/asset', middlewares.auth.requireLogin, function(req, res, next) {
    // maybe do some more user validation of sorts in the future
    var assetData = req.body;
    // read tmp file from fs
    fs.readFile(req.files.asset.path, function(error, blob) {
      if (error) { return next(error); }

      // save it
      handlers.asset.create(res.locals.auth.tokenUserId, assetData.refId, assetData.refContext, blob, res.locals.responder.send);
    });
  });

  app.get('/asset/:hash', function(req, res, next) {
    // maybe do some user validation of sorts in the future
    // if we are here, it means it was not in the filesystem
    handlers.asset.retrieve(res.locals.auth.tokenUserId, req.params.hash, function(error, data) {
      if (error) { return next(error); }
      return res.sendfile(process.env.APP_ROOT + process.env.WEB_ROOT + '/asset/' + req.params.hash);
    });
  });
};
