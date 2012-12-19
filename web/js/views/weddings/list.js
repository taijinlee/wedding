define([
  'jquery',
  'underscore',
  'backbone',
  'collections/weddings',
  'text!./emptyTable.html',
  'text!./tableRow.html'
], function($, _, Backbone, WeddingsCollection, emptyTableTemplate, tableRowTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddings = new WeddingsCollection();
      this.weddings.on('reset', this.renderWeddings, this);

      this.display = [
        { header: 'Name' },
        // { header: 'Date', rowDisplay: function(wedding) { return new Date(wedding.get('date')).toDateString(); } }
      ];
    },

    render: function() {
      this.$el.html(_.template(emptyTableTemplate));
      var $tr = $(this.make('tr'));
      var self = this;
      _.each(this.display, function(columnInfo) {
        $tr.append(self.make('th', {}, columnInfo.header));
      });
      // $tr.append(self.make('th', {}, self.make('a', { 'class': 'btn pull-right', href: self.pather.getUrl('weddingsNew') }, 'Add Wedding')));
      this.$el.find('thead').append($tr);

      this.weddings.fetch();
      return this;
    },

    renderWeddings: function(weddings) {
      var $body = this.$el.find('tbody');
      var self = this;
      weddings.each(function(wedding) {
        $body.append(_.template(tableRowTemplate, { name: wedding.get('name'), link: self.pather.getUrl('weddingShow', { id: wedding.get('id') }) }));
      });
    }
  });

  return View;


});
