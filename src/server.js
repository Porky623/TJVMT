'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
// Configuring the database
const dbConfig = require('./config/database.config.js');
// const port = 3000;
const cookieSession = require('cookie-session');
const passport = require('passport');
// const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
const routes = require('./routes');

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Successfully connected to the database');
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});
mongoose.Promise = global.Promise;


// const HOSTED_DOMAIN = 'http://localhost:3000';

let app = express();

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

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

app.use('/', routes);

app.listen(3000, () => {
  console.log('app running on port 3000');
});