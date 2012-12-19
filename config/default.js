module.exports = {
  app: {
    port: 4000,
    host: 'localhost:4000'
  },

  store: {
    mongo: {
      host: 'localhost',
      port: 27017,
      maxMillisOnWarn: 5000
    }
  },

  googleOAuth: {
    clientId: '669677576804.apps.googleusercontent.com'
  }

};
