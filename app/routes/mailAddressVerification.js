
module.exports = function(app, middlewares, handlers) {

  app.post('/api/mailAddressVerification', middlewares.auth.requireLogin, function(req, res, next) {
    handlers.mailAddressVerification.create(res.locals.auth.tokenUserId, req.body.partyId, res.locals.responder.send);
  });

};
