
module.exports = function(store) {
  var async = require('async');
  var PaymentModel = require(process.env.APP_ROOT + '/models/payment.js')(store);
  var payment = require(process.env.APP_ROOT + '/payment/payment.js')();

  var create = function(paymentData, callback) {
    async.auto({
      collectPayment: function(done) { payment.makePayment(paymentData.paymentToken, paymentData.paymentAmount, done) },
      logPayment: ['collectPayment', function(done) { new PaymentModel(paymentData).create(callback); }]
    }, callback);
  };

  return {
    create: create
  };

};
