define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'text!./add.html',
  'text!./addFormRow.html'
], function($, _, Backbone, UserModel, addFormTemplate, addFormRowTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click #addSubmit': 'createEmployee'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.display = {
        name: 'Name',
        email: 'Email',
        title: 'Title',
        department: 'Department',
        directReport: 'Manager',
        objective: 'Objective',
        keyResults: 'Key Results'
      };
    },

    render: function() {
      this.$el.html(_.template(addFormTemplate));
      var $formSection = this.$el.find('#organization-add-form');
      _.each(this.display, function(displayName, key) {
        $formSection.append(_.template(addFormRowTemplate, { displayName: displayName, key: key, value: null }));
      });
      return this;
    },

    createEmployee: function(event) {
      var userData = {};
      $(event.currentTarget).closest('form').find('input').each(function(index) {
        var $input = $(this);
        userData[$input.attr('id')] = $input.val();
      });
      new UserModel().save(userData, {
        success: function() { Backbone.history.navigate('organization', { trigger: true }); }
      });
      return false;
    }

  });

  return View;

});
