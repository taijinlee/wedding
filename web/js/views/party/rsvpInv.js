define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'models/party',
  'models/wedding',
  'text!./rsvpInv.html',
  'text!./rsvpInvFormRow.html'
], function($, _, Backbone, async, PartyModel, WeddingModel, rsvpInvTemplate, rsvpInvFormRow) {

  var View = Backbone.View.extend({
    events: {
      'click button#submit': 'submit'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0];
      this.weddingAccessToken = args[1];
      this.partyId = args[2];
      this.accessToken = args[3];
      this.party = new PartyModel({ id: this.partyId });
      this.wedding = new WeddingModel({ id: this.weddingId });
    },

    render: function() {
      var self = this;
      async.auto({
        template: function(done) {
          self.$el.html(_.template(rsvpInvTemplate));
          return done();
        },
        wedding: function(done) { 
          self.wedding.fetch({
            data: { accessToken: this.weddingAccessToken },
            success: function(wedding) {
              return done(null, wedding);
            },
            error: function() {
              return done(new Error('generic error?'));
            }
          });
        },
        party: function(done) {
          self.party.fetch({
            data: { accessToken: this.accessToken },
            success: function(wedding) {
              return done(null, wedding);
            },
            error: function() {
              return done(new Error('generic error?'));
            }
          });
        }
      }, function (error, results) {
        if (error) { return; }
        self.renderFormTable();
        return this;
      });
    },

    renderFormTable: function() {
      var $tableBody = this.$el.find('#rsvpInvForm tbody');
      var self = this;
      var meals = this.wedding.get('meals');
      if (meals) {
        meals.unshift('None');
      } else {
        meals = ['None']
      }
      $tableBody.empty();
      _.each(this.party.get('guests'), function(guest, index) {
        if (guest.isAttendingInv === undefined || guest.isAttendingInv === null) {
          guest.isAttendingInv = true;
        }
        if (guest.meal === undefined || guest.meal === null) {
          guest.meal = 'meal_0';
        }
        $tableBody.append(_.template(rsvpInvFormRow, { guest: guest, index: index, meals: meals }))
      });
      return this;
    },

    submit: function(event) {
      event.preventDefault(); event.stopPropagation();
      var values = {};
      _.each(this.$('form').serializeArray(), function(field) {
        values[field.name] = field.value;
      });

      var attendingRegex = /attendingInv-(\d+)/;
      var mealRegex = /meal-(\d+)/;

      var guests = this.party.get('guests');
      _.each(values, function(value, key) {
        var matchesAttending = attendingRegex.exec(key);
        var matchesMeal = mealRegex.exec(key);
        if (matchesAttending) {
          var isAttendingInv = parseInt(value, 10);
          guests[parseInt(matchesAttending[1], 10)].isAttendingInv = Boolean(isAttendingInv);
        } else if (matchesMeal) {
          guests[parseInt(matchesMeal[1], 10)].meal = value;
        }
      });

      var self = this;
      this.party.save({ guests: guests, accessToken: this.accessToken }, {
        error: function(model, response) {
          self.vent.trigger('renderNotification', 'Error', 'error');
          console.log(model);
          console.log(response);
        },
        success: function(model, response) {
          self.$el.find('#rsvpContainer').html('<h2>Thanks!</h2>');
          console.log(model);
          console.log(response);
          console.log(self.vent);
          // this.vent.trigger('renderNotification', 'An email has been sent to you', 'success');
        }
      });

    }

  });

  return View;

});
