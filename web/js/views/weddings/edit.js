define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'text!./edit.html',
  'text!./addFormRow.html'
], function($, _, Backbone, UserModel, editFormTemplate, addFormRowTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click #addSubmit': 'createEmployee'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      var userId = args[0];
      this.user = new UserModel({ id: userId });
      this.user.on('change', this.renderUser, this);

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
      this.$el.html(_.template(editFormTemplate));
      this.user.fetch();
      return this;
    },

    renderUser: function() {
      var $formSection = this.$el.find('#organization-add-form');
      var self = this;
      _.each(this.display, function(displayName, key) {
        $formSection.append(_.template(addFormRowTemplate, { displayName: displayName, key: key, value: self.user.get(key) }));
      });
    },

    createEmployee: function(event) {
      var userData = {};
      $(event.currentTarget).closest('form').find('input').each(function(index) {
        var $input = $(this);
        userData[$input.attr('id')] = $input.val();
      });
      this.user.save(userData, {
        success: function() { Backbone.history.navigate('organization', { trigger: true }); }
      });
      return false;
    }

  });

  return View;

});
