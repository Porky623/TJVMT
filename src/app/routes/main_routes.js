const express = require('express');
const router = express.Router();
const prefix = require('../../config/url-config').prefix;

const authCheck = (req, res, next) => {
    if (!req.user) {
        res.redirect("/auth/login");
    } else {
        next();
    }
};

//Home page
router.get('/', (req, res) => {
    res.locals.metaTags = {
        title: 'TJ VMT',
    };
    res.render('index', {officers: [
            {picture: `${req.app.get('prefix')}images/garrett.jpg`, position: "Captain", name: "Garrett Heller"},
            {picture: `${req.app.get('prefix')}images/drew.jpg`, position: "Co-Captain", name: "Andrew Kim"},
            {picture: `${req.app.get('prefix')}images/mirza.jpg`, position: "Co-Captain", name: "Mirza Hussain"},
            {picture: `${req.app.get('prefix')}images/pranav.jpg`, position: "Statistician", name: "Pranav Mathur"},
            {picture: `${req.app.get('prefix')}images/alvancaleb.png`, position: "Statistician", name: "Alvan Caleb Arulandu"},
            {picture: `${req.app.get('prefix')}images/nikhil.png`, position: "Finance Officer", name: "Nikhil Pesaladinne"},
            {picture: `${req.app.get('prefix')}images/mihika.jpg`, position: "Finance Officer", name: "Mihika Dusad"},
            {picture: `${req.app.get('prefix')}images/aarav.jpg`, position: "Secretary", name: "Aarav Bajaj"},
            {picture: `${req.app.get('prefix')}images/shyla.jpg`, position: "Historian", name: "Shyla Bisht"}
    ], pageName: "home"});
});

router.get('/under_construction', (req, res) => {
    res.locals.metaTags = {
        title: "TJVMT - Page under construction",
    }
    res.render('under_construction');
});

//TJIMO
router.get('/tjimo', (req, res) => {
    res.locals.metaTags = {
        title: 'TJIMO',
    };
    res.render('tjimo');
});

//Archive
router.get('/archive', (req, res) => {
    res.locals.metaTags = {
        title: 'Archive',
    };
    res.render('archive');
});

module.exports = router;