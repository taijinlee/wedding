define([
  'jquery',
  'underscore',
  'backbone',
  'collections/users',
  'text!./emptyTable.html'
], function($, _, Backbone, UserCollection, emptyTableTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.users = new UserCollection();
      this.users.on('reset', this.renderUsers, this);

      this.display = {
        name: 'Name',
        email: 'Email',
        title: 'Title',
        department: 'Dept',
        directReport: 'Manager',
        objective: 'Objective',
        keyResults: 'Key Results'
      };
    },

    render: function() {
      this.$el.html(_.template(emptyTableTemplate));
      var $tr = $(this.make('tr'));
      var self = this;
      _.each(this.display, function(displayName, key) {
        $tr.append(self.make('th', {}, displayName));
      });
      $tr.append(self.make('th', {}, self.make('a', { 'class': 'btn', 'href': 'organization/add' }, 'Add')));
      this.$el.find('thead').append($tr);

      this.users.fetch();
      return this;
    },

    renderUsers: function(users) {
      var $body = this.$el.find('tbody');
      var self = this;
      users.each(function(user) {
        var $tr = $(self.make('tr'));
        _.each(self.display, function(displayName, key) {
          $tr.append(self.make('td', {}, user.get(key)));
        });
        $tr.append(self.make('td', {}, self.make('a', { 'class': 'btn', href: 'organization/edit/' + user.get('id') }, 'Edit')));
        $body.append($tr);
      });
    }
  });

  return View;


});
