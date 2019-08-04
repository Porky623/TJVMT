'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
// Configuring the database
const dbConfig = require('./config/database.config.js');
const port = 3000;

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Successfully connected to the database');
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});
mongoose.Promise = global.Promise;

const HOSTED_DOMAIN = 'http://localhost:3000';

let app = express();

let urlencodedParser = bodyParser.urlencoded({
  extended: false,
});
let jsonParser = bodyParser.json();

app.set('views', path.join(path.resolve(__dirname), 'views'));
let hbs = exphbs.create({
  defaultLayout: 'base',
  extname: '.handlebars',
  layoutsDir: 'src/views/layouts',
  partialsDir: 'src/views/partials',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'static')));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// parse requests of content-type - application/json
app.use(bodyParser.json());

//Home page
app.get('/', (req, res) => {
  res.locals.metaTags = {
    title: 'TJ VMT',
  };
  res.render('index');
});

//Calendar
app.get('/calendar', (req, res) => {
  res.locals.metaTags = {
    title: 'Schedule',
  };
  res.render('calendar');
});

//TJIMO
app.get('/tjimo', (req, res) => {
  res.locals.metaTags = {
    title: 'TJIMO',
  };
  res.render('tjimo');
});

//About
app.get('/about', (req, res) => {
  res.locals.metaTags = {
    title: 'About TJ VMT',
  };
  res.render('about');
});

//Archive
app.get('/archive', (req, res) => {
  res.locals.metaTags = {
    title: 'Archive',
  };
  res.render('archive');
});

//Rankings
app.get('/rankings', (req, res) => {
  res.locals.metaTags = {
    title: 'Rankings',
  };
  res.render('rankings');
});

//Officers
app.get('/officers', (req, res) => {
  res.locals.metaTags = {
    title: 'Officers',
  };
  res.render('officers');
});

//Add Officer
app.get('/add_officer', (req, res) => {
  res.locals.metaTags = {
    title: 'Add Officers',
  };
  res.render('add_officers');
});

//Remove Officers
app.get('/remove_officer', (req, res) => {
  res.locals.metaTags = {
    title: 'Remove Officers',
  };
  res.render('remove_officers');
});

//Add Scores
app.get('/add_score', (req, res) => {
  res.locals.metaTags = {
    title: 'Add Scores',
  };
  res.render('add_scores');
});

//Add Contests
app.get('/add_contest', (req, res) => {
  res.locals.metaTags = {
    title: 'Add Contests',
  };
  res.render('add_contests');
});

//Add Tests
app.get('/add_test', (req, res) => {
  res.locals.metaTags = {
    title: 'Add Tests',
  };
  res.render('add_tests');
});

//Update Indices
app.get('/update_indices', (req, res) => {
  res.locals.metaTags = {
    title: 'Update Indices',
  };
  res.render('update_indices');
});

// Require Users routes
var userRouter = require('./app/routes/user');
app.use('/', userRouter);

const simpleOauthModule = require('simple-oauth2');
const ion_redirect_uri = 'http://localhost:3000/callback';

const credentials = {
  client: {
    id: 'fEQALZYlHGtGQNc8lBOykccmMHEXGpJYQG8c6GBi',
    secret: 'Lv3jYd6OJNWXQ4QxEnj7YAKACOpw1Dd8ierZTIFqW0Cr1tcLg2ItgorwAwg4mveTD3S588Gaba12AueFD51qWo7xzNbgkJNvIt6dJ8TCyWGB9zqnaw7B0HPMN4qIH5vc',
  },
  auth: {
    tokenHost: 'https://ion.tjhsst.edu/oauth',
    tokenPath: 'https://ion.tjhsst.edu/oauth/token',
    authorizePath: 'https://ion.tjhsst.edu/oauth/authorize',
  },
};
const oauth2 = simpleOauthModule.create(credentials);

// Authorization oauth2 URI
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'http://localhost:3000/callback',
  scope: 'read', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
});

// Get the access token object (the authorization code is given from the previous step).
const tokenConfig = {
  code: 'code',
  redirect_uri: 'http://localhost:3000/callback',
  scope: 'read',
};

app.get('/auth', (req, res) => {
  res.redirect(authorizationUri);
});

app.get('/callback', async (req, res) => {
  var code = req.query.code; // GET parameter
  var result = await oauth2.authorizationCode.getToken(
      {code: code, redirect_uri: ion_redirect_uri});
  const token = oauth2.accessToken.create(result);
  var refresh_token = token.token.refresh_token;
  var access_token = token.token.access_token;
  var expires_in = token.token.expires_in;
});

app.get('/login', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with Ion</a>');
});

app.get('/refresh', (req, res) => {
  var token = oauth2.accessToken.create({
    'access_token': access_token,
    'refresh_token': refresh_token,
    'expires_in': expires_in,
  });

  if (token.expired()) {
    token.refresh((err, result) => {
      token = result;
      // the new access token
      var access_token = token.token.access_token;
    });
  }
});

app.listen(3000, () => {
  console.log('app running on port 3000');
});