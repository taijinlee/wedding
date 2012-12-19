
module.exports = function(app, middlewares, handlers) {

  app.post('/api/party', middlewares.auth.requireLogin,  function(req, res, next) {
    var partyData = req.body;
    handlers.party.create(req.auth.tokenUserId, partyData.weddingId, partyData, req.responder.send);
  });

  app.get('/api/party/:partyId', middlewares.entity.exists('party'), function(req, res, next) {
    handlers.party.retrieve(req.auth.tokenUserId, req.params.partyId, req.responder.send);
  });

  app.put('/api/party/:partyId', middlewares.auth.requireLogin, middlewares.entity.exists('party'), function(req, res, next) {
    var updateData = req.body;
    handlers.party.update(req.auth.tokenUserId, req.params.partyId, updateData, req.responder.send);
  });

  app.del('/api/party/:partyId', middlewares.auth.requireLogin, middlewares.entity.exists('party'), function(req, res, next) {
    handlers.party.destroy(req.auth.tokenUserId, req.params.partyId, req.responder.send);
  });

  app.get('/api/party', function(req, res, next) {
    var page = req.param('page', 1);

    var limit = 10;
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

    handlers.party.list(filters, limit, skip, req.responder.send);
  });

};
