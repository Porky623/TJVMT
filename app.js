'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
// Configuring the database
const dbConfig = require('./src/config/database.config.js');
const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./src/config/passport-setup');
const keys = require('./src/config/keys');
const routes = require('./src/routes');
const flash = require('express-flash-notification');

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Successfully connected to the database');
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});
mongoose.Promise = global.Promise;

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

app.set('views', path.join(path.resolve(__dirname), '/src/views'));
let hbs = exphbs.create({
  defaultLayout: 'base',
  extname: '.handlebars',
  layoutsDir: './src/views/layouts',
  partialsDir: './src/views/partials',
  helpers: require('./src/helpers/helpers')
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'src/static')));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(flash(app, {
  sessionName: 'flash',
  utilityName: 'flash',
  localsName: 'flash',
  viewName: 'elements/flash',
  beforeSingleRender: function(item, callback){ callback(null, item) },
  afterAllRender: function(htmlFragments, callback){ callback(null, htmlFragments.join('\n')) }
}));

app.use(function(req,res,next){
  res.locals.user = req.user;
  next();
});

app.use('/', routes);

app.listen(process.env.PORT, function() {
    console.log("Server listening on: " + process.env.PORT);
});