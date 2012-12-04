define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'text!./form.html'
], function($, _, Backbone, UserModel, formTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click #login_button': 'login'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.html(_.template(formTemplate));
      return this;
    },

    login: function() {
      var values = {};
      this.$('input').each(function() {
        values[this.name] = $(this).val();
      });

      $.ajax({
        url: '/api/auth/login',
        type: 'post',
        data: $.param(values),
        success: function(result) {
          Backbone.history.navigate('organization', true);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        }
      });

      return false;
    }


  });

  return View;

});
