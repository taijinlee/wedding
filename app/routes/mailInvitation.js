
module.exports = function(app, middlewares, handlers) {

  app.post('/api/mailInvitation', middlewares.auth.requireLogin, function(req, res, next) {
    handlers.mailInvitation.create(res.locals.auth.tokenUserId, req.body.partyId, res.locals.responder.send);
  });

};
