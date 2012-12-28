
module.exports = function(app, middlewares, handlers) {

  app.post('/api/user', function(req, res, next) {
    var userData = req.body;
    handlers.user.create(userData.email, userData.firstName, userData.lastName, userData.secret, res.locals.responder.send);
  });

  app.post('/api/user/signup', middlewares.entity.exists('user', 'email', 'email', 'negate'), function(req, res, next) {
    var signupData = req.body;
    handlers.user.signup(signupData.email, signupData.firstName, signupData.lastName, signupData.secret, signupData.fianceFirstName, signupData.fianceLastName, res.locals.responder.send);
  });

  app.get('/api/user/:userId', middlewares.entity.exists('user'), function(req, res, next) {
    handlers.user.retrieve(res.locals.auth.tokenUserId, req.params.userId, res.locals.responder.send);
  });

  app.put('/api/user/:userId', middlewares.auth.requireLogin, middlewares.entity.exists('user'), function(req, res, next) {
    var updateData = req.body;
    handlers.user.update(res.locals.auth.tokenUserId, req.params.userId, updateData, res.locals.responder.send);
  });

  app.del('/api/user/:userId', middlewares.auth.requireLogin, middlewares.entity.exists('user'), function(req, res, next) {
    handlers.user.destroy(res.locals.auth.tokenUserId, req.params.userId, res.locals.responder.send);
  });

  app.get('/api/user', function(req, res, next) {
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

    handlers.user.list(filters, limit, skip, res.locals.responder.send);
  });

};
