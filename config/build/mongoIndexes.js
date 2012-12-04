
var mongo = require('mongodb');
var async = require('async');
var _ = require('underscore');

var indexes = [
  { database: 'drinks', collection: 'userActivity', index: {userId: 1, created: -1}},
  { database: 'drinks', collection: 'drinkActivity', index: {drinkId: 1, created: -1}},
  { database: 'drinks', collection: 'ratings', index: {userId: 1, drinkId: 1}, options: {unique: true} },
  { database: 'drinks', collection: 'assetBlobs', index: {hash: 1}, options: {unique: true} },
  { database: 'drinks', collection: 'relationships', index: {userId1: 1, userId2: 1}, options: {unique: true} },
  { database: 'drinks', collection: 'drinks', index: {keywords: 1} }
];

var mongoServer = new mongo.Server('localhost', 27017);
var conn = new mongo.Db('main' /* default db */, mongoServer);

conn.open(function(error, client) {

  var createIndex = function(database, collection, index, options) {
    return function(callback) {
      conn = conn.db(database);
      conn.collection(collection).ensureIndex(index, options, callback);
    };
  };
  var createIndexes = _.map(indexes, function(config) {
    return createIndex(config.database, config.collection, config.index, config.options);
  });

  async.series(
    createIndexes,
    function() {
      conn.close();
    }
  );

});
