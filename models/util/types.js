
define([
  'validator'
], function(validator) {

  // deal with client side
  if (typeof window !== 'undefined' && (typeof window.Validator === 'function')) {
    validator = window;
  }
  validator.Validator.prototype.error = function(msg) { this._errors.push(new Error(msg)); return this; };
  validator.Validator.prototype.isString = function() {
    if (String(this.str) !== this.str || this.str.length === 0) { return this.error(this.msg || 'Not a string'); }
    return this;
  };

  var _validator = function() { return new validator.Validator(); };
  var _sanitize = validator.sanitize;

  var types = {
    activityType: {
      checkType: function(value) { return _validator().check(value).isIn(['checkin', 'rating', 'comment']); }
    },
    authType: {
      checkType: function(value) { return _validator().check(value).isIn(['base', 'google']); }
    },
    bool: {
      // HACK: TODO: make this actually validate. the problem is that currently validator converts everything to string
      // so true boolean value is lost
      // checkType: function(value) { return _validator()},
      sanitize: function(value) { return _sanitize(value).toBooleanStrict(); }
    },
    crud: {
      checkType: function(value) { return _validator().check(value).isIn(['create', 'retrieve', 'update', 'destroy']); }
    },
    email: {
      checkType: function(value) { return _validator().check(value).isEmail(); }
    },
    integer: {
      checkType: function(value) { return _validator().check(value).isInt(); },
      sanitize: function(value) { return _sanitize(value).toInt(); }
    },
    object: {
    },
    rating: {
      checkType: function(value) { return _validator().check(value).isInt().min(0).max(5); }
    },
    relationship: {
      checkType: function(value) { return _validator().check(value).isIn(['none', 'ignored', 'requested', 'blocked']); }
    },
    string: {
      checkType: function(value) { return _validator().check(value).isString(); },
      sanitize: function(value) { return String(value); }
    },
    timestamp: {
      checkType: function(value) { return _validator().check(value).isInt(); }
    },
    userRole: {
      checkType: function(value) { return _validator().check(value).isIn(['user', 'admin']); }
    },
    zip: {
      checkType: function(value) { return _validator().check(value).len(5,5).isInt(); }
    }
  };

  return types;

});
