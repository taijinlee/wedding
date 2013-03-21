module.exports = function(store, history) {

  var PaymentModel = require(process.env.APP_ROOT + '/models/payment.js')(store);
  var WebPaymentModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'payment');

  /* Basic crud */
  var create = function(tokenUserId, paymentToken, paymentAmount, callback) {
    var paymentData = {
      id: store.generateId(),
      userId: tokenUserId,
      paymentToken: paymentToken,
      paymentAmount: paymentAmount
    };

    var payment = new PaymentModel(paymentData);
    if (!payment.isValid()) { return callback(new Error('invalid:invalid input')); } // TODO: make this clearer

    history.record(tokenUserId, 'payment', 'create', paymentData.id, [payment.toJSON()], function(error, historyData) {
      if (error) { return callback(error); }
      // TODO: NEED TO FIX THIS BUT I CANT FIGURE OUT WHY THIS WAS ALWAYS ERRORING OUT - We need to return the callback
//      return callback(null, new WebPaymentModel(payment.toJSON()).toJSON());
    });
  };

  return {
    create: create
  };

};
