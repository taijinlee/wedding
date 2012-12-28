
module.exports = function(store, cookieJar) {

  var exists = function(modelName, param, key, negate) {
    return function(req, res, next) {
      param = param || (modelName + 'Id');
      key = key || 'id';
      var modelKey = req.param(param, null);
      if (!modelKey) { return next(new Error('notFound: ' + modelName + ':' + key + ' expected in parameters')); }

      var criteria = {};
      criteria[key] = modelKey;

      var Model = require(process.env.APP_ROOT + '/models/' + modelName + '.js')(store);

      new Model(criteria).retrieve(function(error, modelData) {
        if (error) { return next(error); }
        if (!negate) {
            if (!modelData) { return next(new Error('notFound: ' + modelName + ':' + key + '=' + modelKey + ' does not exist')); }
        } else {
          if (modelData) { return next(new Error('alreadyExists: ' + modelName + ':' + key + ':' + modelKey)); }
        }

        return next();
      });

    };
  };

  return {
    exists: exists
  };

};