
module.exports = function(app, middlewares, handlers) {

  app.post('/api/guest', middlewares.auth.requireLogin,  function(req, res, next) {
    var guestData = req.body;
    handlers.guest.create(req.auth.tokenUserId, guestData.weddingId, guestData, req.responder.send);
  });

  app.get('/api/guest/:guestId', middlewares.entity.exists('guest'), function(req, res, next) {
    handlers.guest.retrieve(req.auth.tokenUserId, req.params.guestId, req.responder.send);
  });

  app.put('/api/guest/:guestId', middlewares.auth.requireLogin, middlewares.entity.exists('guest'), function(req, res, next) {
    var updateData = req.body;
    handlers.guest.update(req.auth.tokenUserId, req.params.guestId, updateData, req.responder.send);
  });

  app.del('/api/guest/:guestId', middlewares.auth.requireLogin, middlewares.entity.exists('guest'), function(req, res, next) {
    handlers.guest.destroy(req.auth.tokenUserId, req.params.guestId, req.responder.send);
  });

  app.get('/api/guest', function(req, res, next) {
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

    handlers.guest.list(filters, limit, skip, req.responder.send);
  });

};
