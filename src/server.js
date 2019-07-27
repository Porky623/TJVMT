const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const HOSTED_DOMAIN = "http://localhost:3000";


let app = express();

let urlencodedParser = bodyParser.urlencoded({
    extended: false
});
let jsonParser = bodyParser.json();

app.set('views', path.join(path.resolve(__dirname), 'views'));
let hbs = exphbs.create({
    defaultLayout: 'base',
    extname: '.handlebars',
    layoutsDir: 'src/views/layouts',
    partialsDir: 'src/views/partials'
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'static')));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


//Home page
app.get('/', (req, res) => {
    res.locals.metaTags = {
        title: "TJ VMT"
    };
    res.render('index');
});

//Calendar
app.get('/calendar', (req, res) => {
    res.locals.metaTags = {
        title: "Schedule"
    };
    res.render('calendar');
});

//TJIMO
app.get('/tjimo', (req, res) => {
    res.locals.metaTags = {
        title: "TJIMO"
    };
    res.render('tjimo');
});

//About
app.get('/about', (req, res) => {
    res.locals.metaTags = {
        title: "About TJ VMT"
    };
    res.render('about');
});

//Archive
app.get('/archive', (req, res) => {
    res.locals.metaTags = {
        title: "Archive"
    };
    res.render('archive');
});

//Rankings
app.get('/rankings', (req, res) => {
    res.locals.metaTags = {
        title: "Rankings"
    };
    res.render('rankings');
});

//Officers
app.get('/officers', (req, res) => {
    res.locals.metaTags = {
        title: "Officers"
    };
    res.render('officers');
});

//Add Officer
app.get('/add_officer', (req, res) => {
    res.locals.metaTags = {
        title: "Add Officers"
    };
    res.render('add_officers');
});

//Remove Officers
app.get('/remove_officer', (req, res) => {
    res.locals.metaTags = {
        title: "Remove Officers"
    };
    res.render('remove_officers');
});

//Add Scores
app.get('/add_score', (req, res) => {
    res.locals.metaTags = {
        title: "Add Scores"
    };
    res.render('add_scores');
});

//Add Contests
app.get('/add_contest', (req, res) => {
    res.locals.metaTags = {
        title: "Add Contests"
    };
    res.render('add_contests');
});

//Add Tests
app.get('/add_test', (req, res) => {
    res.locals.metaTags = {
        title: "Add Tests"
    };
    res.render('add_tests');
});

//Update Indices
app.get('/update_indices', (req, res) => {
    res.locals.metaTags = {
        title: "Update Indices"
    };
    res.render('update_indices');
});

// Require Tests routes
require('./app/routes/test.routes.js')(app);

// Require Contests routes
require('./app/routes/contest.routes.js')(app);

app.listen(3000, () => {
    console.log('app running on port 3000');
});