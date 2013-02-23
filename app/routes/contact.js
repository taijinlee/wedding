
var _ = require('underscore');

module.exports = function(app, middlewares, handlers) {

  app.get('/api/contacts', middlewares.auth.requireLogin, function(req, res, next) {
    var page = req.param('page', 1);

    var limit = 10;
    var skip = (page - 1) * limit;

    var filters = req.query;
    delete filters.page;
    if (filters.keywords) {
      filters.$and = _.chain(filters.keywords.split('+'))
        .map(function(keyword) { return keyword ? { keywords: { $regex: '^' + keyword } } : null; })
        .compact()
        .value();
    }
    delete filters.keywords;
    filters.userId = res.locals.auth.tokenUserId;

    handlers.contact.list(filters, limit, skip, res.locals.responder.send);
  });

};
