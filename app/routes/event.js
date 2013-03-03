
var _ = require('underscore');

module.exports = function(app, middlewares, handlers) {

  app.post('/api/event', middlewares.auth.requireLogin, function(req, res, next) {
    var eventData = req.body;
    handlers.event.create(res.locals.auth.tokenUserId, eventData.name, eventData.time, eventData.people, eventData.location,  res.locals.responder.send);
  });

  app.get('/api/event/:eventId', middlewares.auth.requireLogin, middlewares.entity.exists('event'), function(req, res, next) {
    handlers.event.retrieve(res.locals.auth.tokenUserId, req.params.eventId, res.locals.responder.send);
  });

  app.put('/api/event/:eventId', middlewares.auth.requireLogin, middlewares.entity.exists('event'), function(req, res, next) {
    var updateData = req.body;
    handlers.event.update(res.locals.auth.tokenUserId, req.params.eventId, updateData, res.locals.responder.send);
  });

  app.del('/api/event/:eventId', middlewares.auth.requireLogin, middlewares.entity.exists('event'), function(req, res, next) {
    handlers.event.destroy(res.locals.auth.tokenUserId, req.params.eventId, res.locals.responder.send);
  });

  app.get('/api/events', function(req, res, next) {
    var page = req.param('page', 1);

    var limit = null;
    var skip = (page - 1) * limit;

    handlers.event.list(filters, limit, skip, res.locals.responder.send);
  });

};
