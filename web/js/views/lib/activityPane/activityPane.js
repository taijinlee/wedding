define([
  'jquery',
  'underscore',
  'backbone',
  'humanize',
  'collections/userActivity',
  'collections/drinkActivity',
  'text!./checkin.html',
  'text!./rating.html'
], function($, _, Backbone, humanize, UserActivityCollection, DrinkActivityCollection, checkinTemplate, ratingTemplate) {

  var View = Backbone.View.extend({
    tagName: 'section',

    initialize: function(vent, pather, cookie) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.vent.on('load:activities', this.renderActivities, this);

      this.$el.append(this.make('h3', {}, 'Recent activity'));
      this.activityList = $(this.make('ul', { 'class': 'activityList unstyled' } ));
      this.$el.append(this.activityList);
    },

    render: function() {
      return this;
    },

    renderActivities: function(activities) {
      activities.each(function(activity) {
        var activityData = activity.toJSON().activity;
        activityData.userUrl = this.pather.getUrl('user', { id: activityData.userId });
        activityData.drinkUrl = this.pather.getUrl('drink', { id: activityData.drinkId });

        var date = new Date(activityData.created);
        activityData.created = humanize.date('Y-m-d h:i:s', date);
        activityData.created = humanize.naturalTime(date);

        var template;
        switch (activity.get('type')) {
        case 'checkin':
          template = _.template(checkinTemplate, activityData);
          break;
        case 'rating':
          template = _.template(ratingTemplate, activityData);
          break;
        default:
          // log some error
        }
        this.activityList.append(template);

      }, this);
    }

  });

  return View;

});
