const express = require('express');
const router = express.Router();
const passport = require('passport');
const marked = require('marked');
const Ind = require('../models/ind');
const Test = require('../models/test');
const User = require('../models/user');
const Score = require('../models/score');
const Contest = require('../models/contest');
const RankPage = require('../models/rankpage');
const Announcement = require('../models/announcement');
const Weighting = require('../models/testWeighting');
const Handlebars = require('express-handlebars');
const prefix = require('../../config/url-config').prefix;
const fs = require('fs')

const authCheck = (req, res, next) => {
    if (!req.user) {
        res.redirect(req.app.get('prefix') + 'auth/login');
    } else {
        next();
    }
};

// auth login
router.get('/auth/login', (req, res) => {
    res.render('login');
});

// auth logout
router.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect(req.app.get('prefix') + '');
});

// auth with Ion
router.get('/auth/ion', passport.authenticate('ion', {
    scope: 'read'
}));

// callback route for Ion to redirect to
// hand control to passport to use code to grab profile info
router.get('/auth/ion/redirect', passport.authenticate('ion', {failureRedirect: prefix + 'auth/login'}), (req, res) => {
    res.redirect(req.app.get('prefix') + '');
});

//Home page
router.get('/', (req, res) => {
    res.locals.metaTags = {
        title: 'TJ VMT',
    };
    res.render('index');
});

//Calendar
router.get('/calendar', (req, res) => {
    res.locals.metaTags = {
        title: 'Schedule',
    };
    res.render('calendar');
});

//TJIMO
router.get('/tjimo', (req, res) => {
    res.locals.metaTags = {
        title: 'TJIMO',
    };
    res.render('tjimo');
});

//Puzzle Hunt
router.get('/puzzle', (req, res) => {
    res.locals.metaTags = {
        title: 'Puzzle Hunt',
    };
    res.render('puzzle');
});

//About
router.get('/news', async (req, res) => {
    res.locals.metaTags = {
        title: 'Announcements',
    };
    let announcements = []
    let allAnnounce = await Announcement.find({});
    for (var i = 0; i < allAnnounce.length; i++) {
        announcements.push({
            title: allAnnounce[i].title,
            body: marked(allAnnounce[i].body),
            date: allAnnounce[i].date
        })
    }
    res.render('news', {announcement: announcements});
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
    let allTests = await Test.find({});
    for (var i = 0; i < allTests.length; i++) {
        await testNames.push(allTests[i].name);
    }
    res.render('rankings_choose_test', {testName: testNames});
});

router.get('/rankings/test/view', async (req, res) => {
    res.locals.metaTags = {
        title: 'Test Rankings',
    };
    if (!(await Test.exists({name: req.query.name}))) {
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
    let query = await Weighting.find({contestName: req.query.name});
    let outWeights = [];
    for (var i = 0; i < query.length; i++) {
        let weight = query[i];
        let test = await Test.findById(weight.testId);
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
//   let scores = await Score.find({testName: "2019hmmtproof"});
//   for(var i=0; i<scores.length; i++) {
//     let user = await User.findOne({username: scores[i].studentUsername});
//     let score = scores[i];
//     let row = [user.lastName+", "+user.firstName];
//     row.push(user.grade);
//     row.push(score.scoreVal);
//     for(var j=0; j<6; j++) {
//       row.push(score.scoreDist.charAt(j));
//     }
//     rows.push(row);
//   }
//   let csvContent = "";
//   rows.forEach(function(rowArray) {
//     let row = rowArray.join(",");
//     csvContent += row + "\r\n";
//   });
//   await fs.writeFile('2019hmmtproof.csv', csvContent, (err)=> {
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