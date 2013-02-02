
module.exports = function(store) {

  var HistoryModel = require(process.env.APP_ROOT + '/models/history.js')(store);
  var logger = require(process.env.APP_ROOT + '/lib/logger.js')();

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

      // for testing purposes, we're not going to check that the historian gets called (mainly because the historian is dynamically required). Not sure if this is a hack or not
      if (process.env.NODE_ENV === 'test') { return callback(null); }

      /* Call to historian to interpret history*/
      params.push(callback);
      var historian = require(process.env.APP_ROOT + '/historian/' + subject + '.js')(store);
      historian[event].apply(null, params);
    });
  };

  return {
    record: record
  };

};
