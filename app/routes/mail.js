
module.exports = function(app, middlewares, handlers) {

  app.post('/api/mail', middlewares.auth.requireLogin, function(req, res, next) {
    var mailData = req.body;
    handlers.mail.create(res.locals.auth.tokenUserId, mailData.to, mailData.from, mailData.subject, mailData.body, res.locals.responder.send);
  });

  /*
  app.get('/api/mail/:mailId', middlewares.entity.exists('mail'), function(req, res, next) {
    handlers.mail.retrieve(res.locals.auth.tokenUserId, req.params.mailId, res.locals.responder.send);
  });

  app.put('/api/mail/:mailId', middlewares.auth.requireLogin, middlewares.entity.exists('mail'), function(req, res, next) {
    var updateData = req.body;
    handlers.mail.update(res.locals.auth.tokenUserId, req.params.mailId, updateData, res.locals.responder.send);
  });
  */
  /*
  app.del('/api/mail/:mailId', middlewares.auth.requireLogin, middlewares.entity.exists('mail'), function(req, res, next) {
    handlers.mail.destroy(res.locals.auth.tokenUserId, req.params.mailId, res.locals.responder.send);
  });
  */

  /*
  app.get('/api/mail', function(req, res, next) {
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

    handlers.mail.list(filters, limit, skip, res.locals.responder.send);
  });
  */

};
