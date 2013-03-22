
module.exports = function(app, middlewares, handlers) {

  app.post('/api/payment', middlewares.auth.requireLogin, function(req, res, next) {
    var paymentData = req.body;
    handlers.payment.create(res.locals.auth.tokenUserId, paymentData.paymentToken, paymentData.paymentAmount, res.locals.responder.send);
  });

};
