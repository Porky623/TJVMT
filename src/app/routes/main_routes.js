const express = require('express');
const router = express.Router();
const passport = require('passport');
const Ind = require('../models/ind');
const Test = require('../models/test');
const User = require('../models/user');
const Score = require('../models/score');
const Contest = require('../models/contest');
const RankPage = require('../models/rankpage');
const Handlebars = require('express-handlebars');
const prefix = require('../../config/url-config').prefix;

const authCheck = (req, res, next) => {
  if(!req.user){
    res.redirect(req.app.get('prefix')+'auth/login');
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
  res.redirect(req.app.get('prefix')+'');
});

// auth with Ion
router.get('/auth/ion', passport.authenticate('ion', {
  scope: 'read'
}));

// callback route for Ion to redirect to
// hand control to passport to use code to grab profile info
router.get('/auth/ion/redirect', passport.authenticate('ion', { failureRedirect: prefix+'auth/login'}), (req, res) => {
  res.redirect(req.app.get('prefix')+'');
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

//About
router.get('/about', (req, res) => {
  res.locals.metaTags = {
    title: 'About TJ VMT',
  };
  res.render('about');
});

//Archive
router.get('/archive', (req, res) => {
  res.locals.metaTags = {
    title: 'Archive',
  };
  res.render('archive');
});

//Rankings
router.get('/rankings', (req, res) => {
  res.locals.metaTags = {
    title: 'Rankings',
  };
  res.render('rankings_choose');
});

//Rankings
router.get('/rankings/test', async (req, res) => {
  res.locals.metaTags = {
    title: 'Test Rankings',
  };
  var testNames = [];
  let allTests = await Test.find({});
  for(var i=0; i<allTests.length; i++) {
      await testNames.push(allTests[i].name);
  }
  res.render('rankings_choose_test', {testName: testNames});
});

router.get('/rankings/test/view', async (req, res) => {
  res.locals.metaTags = {
    title: 'Test Rankings',
  };
  if(!(await Test.exists({name: req.query.name}))) {
    return req.flash({
        type: 'Warning',
        message: 'No test named '+req.query.name,
        redirect: req.app.get('prefix')+'rankings/test'
    })
  }
  else if(!(await RankPage.exists({testName: req.query.name}))) {
    return req.flash({
      type: 'Warning',
      message: 'Ranks for test '+req.query.name+' have not yet been updated',
      redirect: req.app.get('prefix')+'rankings/test'
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
  for(var i=0; i<allContests.length; i++) {
      await contestNames.push(allContests[i].name);
  }
  res.render('rankings_choose_contest', {contestName: contestNames});
});

router.get('/rankings/contest/view', async (req, res) => {
  res.locals.metaTags = {
    title: 'Contest Rankings',
  };
  if(!(await Contest.exists({name: req.query.name}))) {
    return req.flash({
        type: 'Warning',
        message: 'No contest named '+req.query.name,
        redirect: req.app.get('prefix')+'rankings/contest'
    })
  }
  else if(!(await RankPage.exists({testName: req.query.name}))) {
    return req.flash({
      type: 'Warning',
      message: 'Ranks for contest '+req.query.name+' have not yet been updated',
      redirect: req.app.get('prefix')+'rankings/contest'
    })
  }
  let rankPage = await RankPage.findOne({testName: req.query.name});
  let out = rankPage.out;
  res.render('rankings_view_contest', {ranks: out, testName: req.query.name});
});

router.get('/custom', async (req, res) => {

  res.render('officers');
});

module.exports = router;