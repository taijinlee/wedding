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
    clientId: '669677576804-oiqgaqu5qao3606jlqpjij2vln6l4sh5.apps.googleusercontent.com',
    contactScope: 'https://www.google.com/m8/feeds',
    redirectUri: 'http://localhost:4000/api/auth/google/oauth2callback'
  }

};
