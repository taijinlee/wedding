module.exports = function(store, history) {

  var MailModel = require(process.env.APP_ROOT + '/models/mail.js')(store);
  var WebMailModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'mail');

  /* Basic crud */
  var create = function(tokenUserId, recipients, from, subject, body, callback) {
    var mailData = {
      id: store.generateId(),
      userId: tokenUserId,
      to: recipients,
      from: 'Amanda <amanda@apricotwhisk.com>',
      subject: subject,
      body: body
    };
    if (from) { mailData.from = from; }

    var mail = new MailModel(mailData);
    if (!mail.isValid()) { return callback(new Error('invalid:invalid input')); } // TODO: make this clearer

    history.record(tokenUserId, 'mail', 'create', mailData.id, [mail.toJSON()], function(error, historyData) {
      if (error) { return callback(error); }
      return callback(null, new WebMailModel(mail.toJSON()).toJSON());
    });
  };

  /*
  var retrieve = function(tokenUserId, userId, callback) {
    var isSelf = tokenUserId === userId;
    var user = new UserModel({ id: userId });
    if (!user.isExistingFieldsValid()) { return callback(new Error('invalid: user corrupt: id: ' + userId)); }

    getMetadata(user, function(error, user) {
      if (error) { return callback(error); }
      return callback(null, new WebUserModel(user.toJSON()).toJSON());
    });
  };

  var update = function(tokenUserId, userId, updateData, callback) {
    var user = new UserModel(_.extend({ id: userId }, updateData), { parse: true });
    if (!user.isExistingFieldsValid()) { return callback(new Error('invalid: user corrupt: id: ' + userId + ' data:' + JSON.stringify(updateData))); }

    history.record(tokenUserId, 'user', 'update', userId, [userId, updateData], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var destroy = function(tokenUserId, userId, callback) {
    history.record(tokenUserId, 'user', 'remove', userId, [userId], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var list = function(filters, limit, pageId, callback) {
    UserModel.prototype.list(filters, limit, pageId, function(error, users) {
      if (error) { return callback(error); }
      async.map(users, getMetaData, function(error, users) {
        if (error) { return callback(error); }
        return callback(null, _.map(users, function(uwer) { return new WebUserModel(user).toJSON(); }));
      });
    });
  };

  var signup = function(email, firstName, lastName, secret, fianceFirstName, fianceLastName, callback) {
    var userData = {
      id: store.generateId(),
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: 'user'
    };

    var authData = {
      id: store.generateId(),
      userId: userData.id,
      type: 'base',
      identifier: email
    };
    authData.salt = tokenizer.generateSalt();
    authData.secret = tokenizer.generate(authData.salt, secret, 0, 0);

    var weddingData = {
      id: store.generateId(),
      userId: userData.id,
      name: userData.firstName + ' & ' + fianceFirstName,
      mainPartyId: store.generateId()
    };

    var partyData = {
      id: weddingData.mainPartyId,
      weddingId: weddingData.id,
      guests: [
        { salutation: '', firstName: firstName, lastName: lastName, email: email },
        { salutation: '', firstName: fianceFirstName, lastName: fianceLastName, email: '' }
      ]
    };

    var user = new UserModel(userData);
    if (!user.isValid()) { return callback(new Error('invalid:invalid input')); } // TODO: make this clearer

    var auth = new AuthModel(authData);
    if (!auth.isValid()) { return callback(new Error('invalid:invalid input')); } // TODO: make this clearer

    var wedding = new WeddingModel(weddingData);
    if (!wedding.isValid()) { return callback(new Error('invalid:invalid input')); }

    var party = new PartyModel(partyData);
    if (!party.isValid()) { return callback(new Error('invalid:invalid input')); }

    history.record(userData.id, 'user', 'signup', userData.id, [user.toJSON(), auth.toJSON(), wedding.toJSON(), party.toJSON()], function(error, historyData) {
      if (error) { return callback(error); }
      return callback(null, new WebUserModel(user.toJSON()).toJSON());
    });
  };

  var getMetaData = function(user, callback) {
    async.auto({
      userAvatar: function(done) {
        assetManager.getUrl(user.get('imageAssetId'), function(error, url) {
          if (error && error.message !== 'notFound') { return callback(error); }
          user.set('profilePictureUrl', (error) ? '' : url);
          return done(null);
        });
      }
    }, callback);
  };

  */
  return {
    create: create
  };

};
