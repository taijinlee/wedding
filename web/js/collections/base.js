
define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  var Collection = Backbone.Collection.extend({
    parse: function(resp) {
      return _.map(resp.data, function(modelData) {
        return { data: modelData };
      });
    }
  });

  return Collection;

});
