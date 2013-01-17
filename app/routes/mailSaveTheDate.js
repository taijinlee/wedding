
module.exports = function(app, middlewares, handlers) {

  app.post('/api/mailSaveTheDate', middlewares.auth.requireLogin, function(req, res, next) {
    handlers.mailSaveTheDate.create(res.locals.auth.tokenUserId, req.body.partyId, res.locals.responder.send);
  });

};
