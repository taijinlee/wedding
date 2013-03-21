
var stripeApiSecretKey = 'sk_test_3l6XHOYm2vcH3X5XvpZsem3h';
var stripe = require('stripe')(stripeApiSecretKey);

module.exports = function() {

  var config = require(process.env.APP_ROOT + '/config/config.js')();

  var makePayment = function(paymentToken, paymentAmount, callback) {
    stripe.charges.create({
      card : paymentToken,
      amount : paymentAmount,
      currency: 'usd'
    }, function (err, charge) {
      if (err) {
        console.log(err);
      } else {
        var id = charge.id;
        console.log('Success! Charge with Stripe ID ' + id + ' just paid!');
      // save this customer to your database here!
      }

      return callback(null);
    });
  };

  return {
    makePayment: makePayment
  };

};
