'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
// Configuring the database
const dbConfig = require('./config/database.config.js');
const session = require('express-session');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
const routes = require('./routes');
const flash = require('express-flash-notification');
const prefix = require('./config/url-config').local_prefix;
const siteKey = require('./config/url-config').siteKey;
const multipart = require('connect-multiparty');

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

app.use(session({ secret: [keys.session.cookieKey] }));

app.use(passport.initialize());
app.use(passport.session());

let urlencodedParser = bodyParser.urlencoded({
  extended: false,
});
let jsonParser = bodyParser.json();

app.set('views', path.join(path.resolve(__dirname), '/views'));
let hbs = exphbs.create({
  defaultLayout: 'base',
  extname: '.handlebars',
  //For actual site use
  // layoutsDir: './vmt_Node/src/views/layouts',
  // partialsDir: './vmt_Node/src/views/partials',

  //For local use
  layoutsDir: './src/views/layouts',
  partialsDir: './src/views/partials',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('prefix', prefix);

app.use(express.static(path.join(__dirname, 'static')));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(multipart());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(flash(app, {
  sessionName: 'flash',
  utilityName: 'flash',
  localsName: 'flash',
  viewName: 'elements/flash',
  beforeSingleRender: function(item, callback){
    if(item.type) {
      switch(item.type) {
        case 'Warning':
          item.alert_class = 'alert-danger';
          break;
        case 'Success':
          item.alert_class = 'alert-success';
      }
    }
    callback(null, item);
  },
  afterAllRender: function(htmlFragments, callback){ callback(null, htmlFragments.join('\n')) }
}));

app.use(function(req,res,next){
    res.locals.user = req.user;
    res.locals.prefix = prefix;
    res.locals.siteKey = siteKey;
    next();
});

app.use('/', routes);

app.listen(3000, () => {
    console.log("Server listening on: port 3000");
});