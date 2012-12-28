
module.exports = function(app, middlewares, handlers) {

  app.post('/api/checkin', middlewares.auth.requireLogin, middlewares.entity.exists('drink'), function(req, res, next) {
    handlers.checkin.create(res.locals.auth.tokenUserId, req.body.drinkId, res.locals.responder.send);
  });

  app.get('/api/checkin/:checkinId', middlewares.auth.requireLogin, middlewares.entity.exists('checkin'), function(req, res, next) {
    // verify that the user is allowed access to this checkin
    handlers.checkin.retrieve(res.locals.auth.tokenUserId, req.params.checkinId, res.locals.responder.send);
  });

  /*
  app.post('/api/checkin/comment/:checkinId', function(req, res, next) {
    var tokenUserId = res.locals.auth.tokenUserId;
    var checkinId = req.params.checkinId;
    var comment = req.comment;

    handlers.checkin.comment(tokenUserId, checkinId, comment, function(error, data) {
      if (error) { return next(error); }
      return res.json(data);
    });
  });
  */


};
