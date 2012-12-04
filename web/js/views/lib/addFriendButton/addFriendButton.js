define([
  'jquery',
  'underscore',
  'backbone',
  'models/relationship'

], function($, _, Backbone, RelationshipModel) {

  var View = Backbone.View.extend({
    tagName: 'aside',

    events: {
      'click #addFriend': 'addFriend'
    },

    initialize: function(vent, pather, cookie) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.relationship = new RelationshipModel();
    },

    render: function(user) {
      this.user = user;
      this.$el.append(this.make('button', {id: 'addFriend'}, 'Add friend'));
      return this;
    },

    addFriend: function() {
      console.log('yo!');
      console.log(this.user.get('id'));
      var relationship = new RelationshipModel({
        userId1: this.cookie.get('userId'),
        userId2: this.user.get('id'),
        relationship1: 'requested'
      });
      console.log(relationship.toJSON());
      relationship.save();
      return false;
    }

  });

  return View;

});
