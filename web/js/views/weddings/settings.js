define([
  'jquery',
  'underscore',
  'backbone',
  'models/wedding',
  'text!./settings.html',
  'text!../party/addressForm.html',
  'text!./invTextForm.html'
], function($, _, Backbone, WeddingModel, settingsFormTemplate, addressFormTemplate, invTextFormTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click #settingsSubmit': 'saveSettings',
      'focus #weddingMeals div:last-child': 'addMealInput'
    },

    initialize: function(config, vent, pather, cookie, args) {
      this.config = config; this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.weddingId = args[0];
      this.wedding = new WeddingModel({ id: this.weddingId });

      this.wedding.on('change', this.renderWeddingSettings, this);
      this.meals = 0;
    },

    render: function() {
      this.wedding.fetch({ id: this.weddingId });
      return this;
    },

    renderWeddingSettings: function() {
      var backUrl = this.pather.getUrl('userGuestlist');
      var weddingName = this.wedding.get('name');
      var participantNames = ["",""];
      if (weddingName && weddingName.indexOf('&') !== -1) {
        participantNames = weddingName.split(' & ');
      }
      this.$el.html(_.template(settingsFormTemplate, { wedding: this.wedding, backUrl: backUrl, participant1Name: participantNames[0], participant2Name: participantNames[1] }));
      this.$el.find('#date').datepicker();
      this.$el.find('#weddingLocation').html(_.template(addressFormTemplate, {address: this.wedding.get('address'), showButtons: false }));
      this.$el.find('#weddingInvText').html(_.template(invTextFormTemplate, { invText: this.wedding.get('invText') }));
      var meals = this.wedding.get('meals');
      if (!meals || meals.length === 0) { meals = []; }
      meals.push('');
      var $mealsSection = this.$el.find('#weddingMeals');
      _.each(meals, function(meal) {
        var input = this.make('input', { type: 'text', placeholder: 'Meal name', name: 'meal_' + this.meals, class: 'span4', value: meal });
        $mealsSection.append(this.make('div', {}, input));
        this.meals += 1;
      }, this);
    },

    addMealInput: function(meal) {
      var $mealsSection = this.$el.find('#weddingMeals');
      var input = this.make('input', { type: 'text', placeholder: 'Meal name', name: 'meal_' + this.meals, class: 'span4' });
      $mealsSection.append(this.make('div', {}, input));
      this.meals += 1;
    },

    saveSettings: function(event) {
      event.preventDefault(); event.stopPropagation();
      var values = {};
      _.each(this.$('form').serializeArray(), function(field) {
        if (field.value) {
          values[field.name] = field.value;
        }
      });
      values.name = (values.weddingName1 ? values.weddingName1 : '') + ' & ' + (values.weddingName2 ? values.weddingName2 : '');

      var mealRegexp = /meal_(\d)/;
      var weddingData = _.reduce(values, function(memo, value, formKey) {
        if (!value) { return memo; }
        if (formKey.indexOf('meal') === -1) {
          memo[formKey] = value;
          return memo;
        }
        var matches = formKey.match(mealRegexp);
        memo.meals.push(value);
        return memo;
      }, { meals: [] });

      var self = this;
      this.wedding.save(weddingData, {
        error: function(model, response) {
          self.vent.trigger('renderNotification', 'Error', 'error');
          console.log(model);
          console.log(response);
        },
        success: function(model, response) {
          Backbone.history.navigate(self.pather.getUrl('userGuestlist'), { trigger: true });
          console.log(model);
          console.log(response);
          console.log(self.vent);
        },
        silent: true
      });

      return false;
    }
  });

  return View;

});
