
var tokenizer = require(process.env.APP_ROOT + '/tokenizer/tokenizer.js')();

module.exports = function(app, middlewares, handlers) {

  app.post('/api/party', middlewares.auth.requireLogin,  function(req, res, next) {
    var partyData = req.body;
    handlers.party.create(res.locals.auth.tokenUserId, partyData.weddingId, partyData, res.locals.responder.send);
  });

  app.get('/api/party/:partyId', middlewares.entity.exists('party'), function(req, res, next) {
    var partyId = req.params.partyId;

    var isTokenValid = false;
    if (req.query.tokenWithTime) {
      var tokenWithTime = req.query.tokenWithTime.split('-');
      isTokenValid = tokenizer.match(partyId, 'addressVerification', decodeURIComponent(tokenWithTime[1]), 604800000 /* 1week */, decodeURIComponent(tokenWithTime[0]));
    }
    if (!isTokenValid && res.locals.auth.tokenUserId === false) { return next(new Error('unauthorized: require login')); }
    handlers.party.retrieve(res.locals.auth.tokenUserId, partyId, res.locals.responder.send);
  });

  app.put('/api/party/:partyId', middlewares.entity.exists('party'), function(req, res, next) {
    var partyId = req.params.partyId;

    var isTokenValid = false;
    if (req.body.tokenWithTime) {
      var tokenWithTime = req.body.tokenWithTime.split('-');
      isTokenValid = tokenizer.match(partyId, 'addressVerification', decodeURIComponent(tokenWithTime[1]), 604800000 /* 1week */, decodeURIComponent(tokenWithTime[0]));
    }
    if (!isTokenValid && res.locals.auth.tokenUserId === false) { return next(new Error('unauthorized: require login')); }
    var updateData = req.body;
    handlers.party.update(res.locals.auth.tokenUserId, partyId, updateData, res.locals.responder.send);
  });

  app.del('/api/party/:partyId', middlewares.auth.requireLogin, middlewares.entity.exists('party'), function(req, res, next) {
    handlers.party.destroy(res.locals.auth.tokenUserId, req.params.partyId, res.locals.responder.send);
  });

  app.get('/api/party', function(req, res, next) {
    var page = req.param('page', 1);

    var limit = null;
    var skip = (page - 1) * limit;

    var filters = req.query;
    delete filters.page;
    if (filters.keywords) {
      filters['$and'] = _.chain(filters.keywords.split('+'))
        .map(function(keyword) { return keyword ? { keywords: { $regex: '^' + keyword } } : null; })
        .compact()
        .value();
    }
    delete filters.keywords;

    handlers.party.list(filters, limit, skip, res.locals.responder.send);
  });

};
