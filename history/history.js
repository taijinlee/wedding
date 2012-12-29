
module.exports = function(store) {

  var HistoryModel = require(process.env.APP_ROOT + '/models/history.js')(store);
  var logger = require(process.env.APP_ROOT + '/logger/logger.js')();

  var record = function(userId, subject, event, subjectId, params, callback) {
    var history = new HistoryModel({
      id: store.generateId(),
      userId: userId,
      subject: subject,
      event: event,
      entityId: subjectId,
      params: params
    });

    history.create(function(error, historyData) {
      if (error) { return callback(error); }

      /* Call to historian to interpret history*/
      // log error on error, otherwise no need to do anything
      params.push(callback); // function(error) { if (error) { return logger.error(error); } });
      var historian = require(process.env.APP_ROOT + '/historian/' + subject + '.js')(store);
      historian[event].apply(null, params);

      // return callback(null, historyData);
    });
  };

  return {
    record: record
  };

};
