
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/wedding',

    schema: {
      id: { type: 'string', optional: true },
      fianceName: { type: 'string' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    },

    name: function() {
      return this.user.get('name') + ' & ' + this.fiance.get('name');
    }



  });

  return Model;

});
