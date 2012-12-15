
module.exports = function(app, middlewares, handlers) {

  app.post('/api/wedding', middlewares.auth.requireLogin, function(req, res, next) {
    var fianceData = req.body;
    handlers.wedding.create(req.auth.tokenUserId, fianceData.fianceFirstName, fianceData.fianceLastName, req.responder.send);
  });

  app.get('/api/wedding/:weddingId', middlewares.auth.requireLogin, middlewares.entity.exists('wedding'), function(req, res, next) {
    handlers.wedding.retrieve(req.auth.tokenUserId, req.params.weddingId, req.responder.send);
  });

  app.put('/api/wedding/:weddingId', middlewares.auth.requireLogin, middlewares.entity.exists('wedding'), function(req, res, next) {
    var updateData = req.body;
    handlers.wedding.update(req.auth.tokenUserId, req.params.weddingId, updateData, req.responder.send);
  });

  app.del('/api/wedding/:weddingId', middlewares.auth.requireLogin, middlewares.entity.exists('wedding'), function(req, res, next) {
    handlers.wedding.destroy(req.auth.tokenUserId, req.params.weddingId, req.responder.send);
  });

  app.get('/api/wedding', function(req, res, next) {
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

    handlers.wedding.list(filters, limit, skip, req.responder.send);
  });

};
