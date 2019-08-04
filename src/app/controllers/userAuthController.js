'use strict';
const express = require('express');
const app = express();
const simpleOauthModule = require('simple-oauth2');
const ion_redirect_uri = 'http://localhost:3000/callback';

const oauth2 = simpleOauthModule.create({
  client: {
    id: 'fEQALZYlHGtGQNc8lBOykccmMHEXGpJYQG8c6GBi',
    secret: 'Lv3jYd6OJNWXQ4QxEnj7YAKACOpw1Dd8ierZTIFqW0Cr1tcLg2ItgorwAwg4mveTD3S588Gaba12AueFD51qWo7xzNbgkJNvIt6dJ8TCyWGB9zqnaw7B0HPMN4qIH5vc',
  },
  auth: {
    tokenHost: 'https://ion.tjhsst.edu/oauth',
  }
  // options: {
  //   authorizationMethod: 'body',
  // }
});
// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: ion_redirect_uri,
  scope: 'read',
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  console.log(authorizationUri);
  res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', async (req, res) => {
  var code = req.query.code; // GET parameter
  try {
    const result = await oauth2.authorizationCode.getToken(
        {code: code, redirect_uri: ion_redirect_uri}, (error, result) => {
          const token = oauth2.accessToken.create(result);

          // you will want to save these variables in your session if you want to make API requests
          var refresh_token = token.token.refresh_token;
          var access_token = token.token.access_token;
          var expires_in = token.token.expires_in;

          // log the user in
        });
  } catch(error) {
    return res.status(500).json('Authentication failed');
  }
});

app.get('/login', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with Ion</a>');
});