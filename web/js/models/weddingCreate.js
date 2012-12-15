
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/wedding',

    schema: {
      id: { type: 'string', optional: true },
      fianceFirstName: { type: 'string' },
      fianceLastName: { type: 'string' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    },

    name: function() {
      return this.user.get('firstName') + ' & ' + this.fiance.get('firstName');
    }



  });

  return Model;

});
