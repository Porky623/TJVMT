const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const HOSTED_DOMAIN = "http://localhost:3000";


let app = express();
let urlencodedParser = bodyParser.urlencoded({
    extended: false
});
let jsonParser = bodyParser.json();


app.engine('.handlebars', exphbs({
    defaultLayout: 'base',
    extname: '.handlebars',
    layoutsDir:'views/layouts',
    partialsDir:'views/partials'
}));
app.set('view engine', '.handlebars');

app.use(express.static(path.join(__dirname, '/public')))

// index
app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('app running on port 3000');
});