const express = require('express');
const router = express.Router();
const passport = require('passport');
const Test = require('../models/test');
const User = require('../models/user');
const Contest = require('../models/contest');
const Handlebars = require('express-handlebars');
const prefix = require('../../config/url-config').prefix;
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const { officerCheck } = require('./officer');

const authCheck = (req, res, next) => {
    if (req.user) {
        res.redirect(req.app.get('prefix'));
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
            {picture: req.app.get('prefix') + 'images/garrett.jpg', position: "Captain", name: "Garrett Heller"},
            {picture: req.app.get('prefix') + 'images/drew.jpg', position: "Co-Captain", name: "Andrew Kim"},
            {picture: req.app.get('prefix') + 'images/mirza.jpg', position: "Co-Captain", name: "Mirza Hussain"},
            {picture: req.app.get('prefix') + 'images/pranav.jpg', position: "Statistician", name: "Pranav Mathur"},
            {picture: req.app.get('prefix') + 'images/alvancaleb.png', position: "Statistician", name: "Alvan Caleb Arulandu"},
            {picture: req.app.get('prefix') + 'images/nikhil.png', position: "Finance Officer", name: "Nikhil Pesaladinne"},
            {picture: req.app.get('prefix') + 'images/mihika.jpg', position: "Finance Officer", name: "Mihika Dusad"},
            {picture: req.app.get('prefix') + 'images/aarav.jpg', position: "Secretary", name: "Aarav Bajaj"},
            {picture: req.app.get('prefix') + 'images/shyla.jpg', position: "Historian", name: "Shyla Bisht"}
    ], pageName: "home"});
});

router.get('/under_construction', (req, res) => {
    res.locals.metaTags = {
        title: "TJVMT - Page under construction",
    }
    res.render('under_construction');
});

// auth login
router.get('/auth/login', authCheck, (req, res) => {
    res.render('login');
});

router.post('/auth/login', authCheck, (req, res, next) => {
     passport.authenticate("ion", function(err, user, info) {
        if (err) {
            return req.flash({
                type: "Warning",
                message: "An error occured while logging in.",
                redirect: req.app.get("prefix") + "auth/login"
            });
        }
        if (!user) {
            return req.flash({
                type: "Warning",
                message: "User " + req.body.ionUsername + " does not exist.",
                redirect: req.app.get("prefix") + "auth/login"
            });
        }
        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            res.redirect(req.app.get('prefix'));
        });
     })(req, res, next);
});

// auth logout
router.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect(req.app.get('prefix'));
});

// auth register
router.get('/auth/register', (req, res) => {
    res.render('register');
});

router.post('/auth/register', [
    body("firstName").toLowerCase(),
    body("lastName").toLowerCase(),
    body("email").isEmail().normalizeEmail(),
    body("gradYear", "Please do not make an account if you are not a current high school student.").isNumeric().custom((value, { req }) => value >= 2021 && value <= 2024),
    body("ionUsername", "Invalid ION Username format.").toLowerCase().matches(/\d{4}\w+/, "i"),
    body("password", "Please provide a password that is at least 6 characters long.").isLength({ min: 6 }),
    body("confirmPassword", "The provided passwords do not match.").custom((value, { req }) => value == req.body.password)
], async (req, res) => {
    if (await User.exists({ionUsername: req.body.ionUsername})) {
        return req.flash({
            type: "Warning",
            message: "A user with that ION ID already exists.",
            redirect: req.app.get('prefix') + 'auth/login'
        });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        res.render('register', {errors: errors.array()});
    }

    let user = await new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.gradYear = req.body.gradYear;
    user.email = req.body.email;
    user.ionUsername = req.body.ionUsername;
    user.password = user.generateHash(req.body.password);
    user.onEmailList = req.body.emailList == "on";
    await user.save();

    return req.flash({
        type: "Success",
        message: "Created an account for " + req.body.ionUsername + ".",
        redirect: req.app.get('prefix') + 'auth/login'
    })
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

//Rankings
router.get('/rankings/test', async (req, res) => {
    res.locals.metaTags = {
        title: 'Test Rankings',
    };
    var testNames = [];
    var allTests = await Test.find({});
    for (var i = 0; i < allTests.length; i++) {
        await testNames.push(allTests[i].name);
    }
    allTests = await ARMLTest.find({});
    for (var i = 0; i < allTests.length; i++) {
        await testNames.push(allTests[i].name);
    }
    res.render('rankings_choose_test', {testName: testNames});
});

router.get('/rankings/test/view', async (req, res) => {
    res.locals.metaTags = {
        title: 'Test Rankings',
    };
    if (!(await Test.exists({name: req.query.name}))&&!(await ARMLTest.exists({name: req.query.name}))) {
        return req.flash({
            type: 'Warning',
            message: 'No test named ' + req.query.name,
            redirect: req.app.get('prefix') + 'rankings/test'
        })
    } else if (!(await RankPage.exists({testName: req.query.name}))) {
        return req.flash({
            type: 'Warning',
            message: 'Ranks for test ' + req.query.name + ' have not yet been updated',
            redirect: req.app.get('prefix') + 'rankings/test'
        })
    }
    let rankPage = await RankPage.findOne({testName: req.query.name});
    let out = rankPage.out;
    res.render('rankings_view_test', {ranks: out, testName: req.query.name});
});

//Rankings
router.get('/rankings/contest', async (req, res) => {
    res.locals.metaTags = {
        title: 'Contest Rankings',
    };
    var contestNames = [];
    let allContests = await Contest.find({});
    for (var i = 0; i < allContests.length; i++) {
        await contestNames.push(allContests[i].name);
    }
    res.render('rankings_choose_contest', {contestName: contestNames});
});

router.get('/rankings/contest/view', async (req, res) => {
    res.locals.metaTags = {
        title: 'Contest Rankings',
    };
    if (!(await Contest.exists({name: req.query.name}))) {
        return req.flash({
            type: 'Warning',
            message: 'No contest named ' + req.query.name,
            redirect: req.app.get('prefix') + 'rankings/contest'
        })
    } else if (!(await RankPage.exists({testName: req.query.name}))) {
        return req.flash({
            type: 'Warning',
            message: 'Ranks for contest ' + req.query.name + ' have not yet been updated',
            redirect: req.app.get('prefix') + 'rankings/contest'
        })
    }
    let rankPage = await RankPage.findOne({testName: req.query.name});
    let out = rankPage.out;
    let contest=await Contest.findOne({name: req.query.name});
    let outWeights=[];
    for (var i = 0; i < contest.weighting.length; i++) {
        let weight = await Weighting.findById(contest.weighting[i]);
        let test = await Test.findById(weight.testId);
        if(test==null) {
            test = await ARMLTest.findById(weight.testId);
        }
        await outWeights.push({
            name: test.name,
            weight: weight.weighting
        });
    }
    res.render('rankings_view_contest', {ranks: out, weights: outWeights, testName: req.query.name});
});

module.exports = router;