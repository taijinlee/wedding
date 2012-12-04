define([
  'jquery',
  'underscore',
  'backbone',
  'text!./breadCrumb.html'
], function($, _, Backbone, breadCrumbTemplate) {

  var BreadCrumbView = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    /**
     * breadCrumbHierarchy in format
     * [ {name: name, url: url}, ... ] in order of hierarchy. Last url is ignored
     */
    render: function(breadCrumbHierarchy) {
      var $ul = $(this.make('ul', {'class': 'breadcrumb'}));

      var activeCrumb = breadCrumbHierarchy.pop();
      _.each(breadCrumbHierarchy, function(crumb) {
        $ul.append(_.template(breadCrumbTemplate, crumb));
      }, this);
      $ul.append(this.make('li', {'class': 'active'}, activeCrumb.name));

      this.$el.html($ul);
      return this;
    }

  });
  return BreadCrumbView;

});
