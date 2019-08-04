// Import the express lirbary
const express = require('express');

const clientID = InsertClientID;
const clientSecret = InsertClientSecret;

const app = express();
const simpleoauth2 = require('simple-oauth2');
const oauth2 = simpleoauth2.create({
  client: {
    id: clientID,
    secret: clientSecret,
  },
  auth: {
    tokenHost: 'https://ion.tjhsst.edu/oauth',
  },
});

app.get('/', (req, res) => {
  let login_url = oauth2.authorizationCode.authorizeURL({
    scope: 'read', // remove scope: read if you also want write access
    redirect_uri: 'http://localhost:8080/oauth/redirect',
  });
  res.redirect(login_url);
});

app.get('/oauth/redirect', (req, res) => {
  let code = req.query.code; // GET parameter
  oauth2.authorizationCode.getToken(
      {code: code, redirect_uri: 'http://locahost:8080/oauth/redirect'},
      (error, result) => {
        const token = oauth2.accessToken.create(result);

        // you will want to save these variables in your session if you want to make API requests
        var refresh_token = token.token.refresh_token;
        var access_token = token.token.access_token;
        var expires_in = token.token.expires_in;
        res.redirect('/?access_token=${access_token}');

        // log the user in
      })().catch(error => {
    console.error(error);
  });
});

// Start the server on port 8080
app.listen(8080);