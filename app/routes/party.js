
var _ = require('underscore');
var async = require('async');
var tmp = require('tmp');
var fs = require('fs');

var tokenizer = require(process.env.APP_ROOT + '/lib/tokenizer.js')();

module.exports = function(app, middlewares, handlers) {

  app.post('/api/party', middlewares.auth.requireLogin,  function(req, res, next) {
    var partyData = req.body;
    handlers.party.create(res.locals.auth.tokenUserId, partyData.weddingId, partyData, res.locals.responder.send);
  });

  app.get('/api/party/:partyId', middlewares.entity.exists('party'), function(req, res, next) {
    var partyId = req.params.partyId;

    var isTokenValid = req.query.accessToken ? tokenizer.match(partyId, 'addressVerification', 0, 0, decodeURIComponent(req.query.accessToken)) : false;
    if (!isTokenValid && res.locals.auth.tokenUserId === false) { return next(new Error('unauthorized: require login')); }
    handlers.party.retrieve(res.locals.auth.tokenUserId, partyId, res.locals.responder.send);
  });

  app.put('/api/party/:partyId', middlewares.entity.exists('party'), function(req, res, next) {
    var partyId = req.params.partyId;

    var isTokenValid = false;
    if (req.body.accessToken) {
      isTokenValid = tokenizer.match(partyId, 'addressVerification', 0, 0, decodeURIComponent(req.body.accessToken));
      res.locals.auth.tokenUserId = 'guest';
    }
    if (!isTokenValid && res.locals.auth.tokenUserId === false) { return next(new Error('unauthorized: require login')); }
    var updateData = req.body;
    handlers.party.update(res.locals.auth.tokenUserId, partyId, updateData, res.locals.responder.send);
  });

  app.del('/api/party/:partyId', middlewares.auth.requireLogin, middlewares.entity.exists('party'), function(req, res, next) {
    handlers.party.destroy(res.locals.auth.tokenUserId, req.params.partyId, res.locals.responder.send);
  });

  /* address verification routes */
  app.get('/api/party/address/:partyId', middlewares.entity.exists('party'), function(req, res, next) {
    if (!req.query.accessToken) { return next(new Error('unauthorized: require token')); }
    var partyId = req.params.partyId;

    if (!tokenizer.match(partyId, 'addressVerification', 0, 0, decodeURIComponent(req.query.accessToken))) {
      return next(new Error('unauthorized: token invalid'));
    }

    // replace 'guest' with the email that was used to respond at some point
    handlers.party.retrieve('guest', partyId, function(error, partyData) {
      if (error) { return res.locals.responder.send(error); }
      return res.locals.responder.send(null, { id: partyData.id, address: (partyData.address || ''), created: partyData.created });
    });
  });

  app.put('/api/party/address/:partyId', middlewares.entity.exists('party'), function(req, res, next) {
    if (!req.body.accessToken) { return next(new Error('unauthorized: require token')); }
    var partyId = req.params.partyId;

    if (!tokenizer.match(partyId, 'addressVerification', 0, 0, decodeURIComponent(req.body.accessToken))) {
      return next(new Error('unauthorized: token invalid'));
    }

    // replace 'guest' with the email that was used to respond at some point
    handlers.party.update('guest', partyId, { address: req.body.address, addressVerified: true }, res.locals.responder.send);
  });



  app.get('/api/party', function(req, res, next) {
    var page = req.param('page', 1);

    var limit = null;
    var skip = (page - 1) * limit;

    var filters = req.query;
    var isDownload = (filters.download ? true: false);
    delete filters.download;
    delete filters.page;
    if (filters.keywords) {
      filters.$and = _.chain(filters.keywords.split('+'))
        .map(function(keyword) { return keyword ? { keywords: { $regex: '^' + keyword } } : null; })
        .compact()
        .value();
    }
    delete filters.keywords;

    handlers.party.list(res.locals.auth.tokenUserId, filters, limit, skip, function(error, partys) {
      if (error) { return next(error); }
      if (!isDownload) { return res.locals.responder.send(null, partys); }

      var csv = [
        { headerName: 'Name' , value: function(party, guest) { return guest.name; } },
        { headerName: 'E-mail', value: function(party, guest) { return guest.email; } },
        { headerName: 'Category', value: function(party, guest) { return party.category; } },
        { headerName: 'Address', value: function(party, guest) { return party.address; } },
        { headerName: 'Address Verified?', value: function(party, guest) { return party.addressVerified ? 'Yes' : 'No'; } },
        { headerName: 'Guest Priority', value: function(party, guest) { return party.priority; } }
      ];

      var headers = _.pluck(csv, 'headerName').join(',');
      var csvData = _.chain(partys).map(function(party) {
        return _.map(party.guests, function(guest) {
          return _.map(csv, function(csvColumnConfig) {
            return '"' + csvColumnConfig.value(party, guest) + '"';
          }).join(',');
        });
      }).flatten(true/*shallow*/).value().join("\n");
      var fileData = headers + "\n" + csvData;

      async.auto({
        // not sure how tmp implements delete, so manually deleting so less chance of mem leak
        fileName: async.apply(tmp.tmpName, { dir: process.env.APP_ROOT + '/tmp', keep: true }),
        tempFile: ['fileName', function(done, results) {
          fs.writeFile(results.fileName, fileData, done);
        }]
      }, function(error, results) {
        if (error) { return res.locals.responder.send(error); }
        res.download(results.fileName, 'guestlist.csv', function(error) {
          fs.unlink(results.fileName); // manual cleanup
        });
      });
    });
  });

};
