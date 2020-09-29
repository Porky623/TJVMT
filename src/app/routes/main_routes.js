const express = require('express');
const router = express.Router();
const passport = require('passport');
const Test = require('../models/test');
const User = require('../models/user');
const Contest = require('../models/contest');
const Handlebars = require('express-handlebars');
const prefix = require('../../config/url-config').prefix;
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
            {picture: '/images/derek.jpg', position: "Captain", name: "Derek Dong"},
            {picture: '/images/kevin.jpg', position: "Co-Captain", name: "Kevin Son"},
            {picture: '/images/drew.jpg', position: "Co-Captain", name: "Andrew Kim"},
            {picture: '/images/garrett.jpg', position: "Statistician", name: "Garrett Heller"},
            {picture: '/images/pranav.jpg', position: "Statistician", name: "Pranav Mathur"},
            {picture: '/images/hilal.png', position: "Finance Officer", name: "Hilal Hussain"},
            {picture: '/images/shyla.jpg', position: "Finance Officer", name: "Shyla Bisht"},
            {picture: '/images/aarav.jpg', position: "Secretary", name: "Aarav Bajaj"},
            {picture: '/images/zia.jpg', position: "Historian", name: "Zia Sun"}
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
            return next(err);
        }
        if (!user) {
            return next(err);
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

router.post('/auth/register', async (req, res) => {
    if (await User.exists({ionUsername: req.body.ionUsername})) {
        return req.flash({
            type: "Warning",
            message: "An user with that ION id already exists.",
            redirect: req.app.get('prefix') + 'auth/login'
        });
    }

    let user = await new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.gradYear = req.body.gradYear;
    user.email = req.body.email;
    user.ionUsername = req.body.ionUsername;
    user.password = user.generateHash(req.body.password);
    await user.save();

    res.redirect(req.app.get('prefix'));
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

router.get('/custom', async (req, res) => {
    res.render('officers');
});

// router.get('/custom', async(req, res) => {
//   const rows = [];
//   let scores = await ARMLScore.find({testName: "arml0305"});
//   for(var i=0; i<scores.length; i++) {
//     let user = await User.findOne({username: scores[i].studentUsername});
//     let score = scores[i];
//     let row = [user.lastName+", "+user.firstName];
//     row.push(user.grade);
//     row.push(score.indScore);
//     row.push(score.teamScore);
//     row.push(score.relayScore);
//     rows.push(row);
//   }
//   let csvContent = "";
//   rows.forEach(function(rowArray) {
//     let row = rowArray.join(",");
//     csvContent += row + "\r\n";
//   });
//   await fs.writeFile('arml0305.csv', csvContent, (err)=> {
//     if(err) throw err;
//   });
//   res.render('officers');
// });

// router.get('/custom', async (req, res) => {
//   res.locals.metaTags = {
//     title: 'Update Users',
//   };
//   res.render('custom');
// });
// router.post('/custom', async(req,res,next)=> {
//   let currentUser = await User.findOne({username: req.body.ion_username});
//   if(currentUser){
//     return req.flash({
//       type: "Warning",
//       message: "User already exists",
//       redirect: req.app.get('prefix')+'custom'
//     })
//   } else {
//     // if not, create user in our db
//     let newUser = new User({
//       firstName: req.body.first_name,
//       lastName: req.body.last_name,
//       gradYear: req.body.graduation_year,
//       email: req.body.tj_email,
//       username: req.body.ion_username,
//       grade: req.body.grade,
//       isOfficer: false,
//     });
//     await newUser.save();
//     res.redirect(req.app.get('prefix')+'custom');
//   }
// });

module.exports = router;