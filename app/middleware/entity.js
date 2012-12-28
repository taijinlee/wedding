
module.exports = function(store, cookieJar) {

  var exists = function(modelName, param, key) {
    return function(req, res, next) {
      param = param || (modelName + 'Id');
      key = key || 'id';
      var modelKey = req.param(param, null);
      if (!modelKey) { return next(new Error('notFound: ' + modelName + ':' + key + ' expected in parameters')); }
        
      fetch(key, modelKey, modelName, function(error, modelData) {
        if (error) {return next(error)};
        if (!modelData) { return next(new Error('notFound: ' + modelName + ':' + key + '=' + modelKey + ' does not exist')); }
        return next();
      });
    };
  };

  var notExists = function(modelName, param, key) {
    return function(req, res, next) {
      param = param || (modelName + 'Id');
      key = key || 'id';
      var modelKey = req.param(param, null);
      if (!modelKey) { return next(new Error('notFound: ' + modelName + ':' + key + ' expected in parameters')); }
      fetch(key, modelKey, modelName, function(error, modelData) {
        if (error) {return next(error)};
        if (modelData) { return next(new Error('alreadyExists: ' + modelName + ':' + key + ':' + modelKey)); }
        return next();
      });
    };
  }; 

  var fetch = function(key, modelKey, modelName, callback) {
    var criteria = {};
    criteria[key] = modelKey;
    var Model = require(process.env.APP_ROOT + '/models/' + modelName + '.js')(store);
    new Model(criteria).retrieve(callback); 
  };                                                         

  return {
    exists: exists,
    notExists : notExists
  };

};