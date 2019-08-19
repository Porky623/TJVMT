const express = require('express');
const router = express.Router();
const passport = require('passport');
const Ind = require('../models/ind');
const Test = require('../models/test');
const User = require('../models/user');
const Score = require('../models/score');
const Handlebars = require('express-handlebars');

const authCheck = (req, res, next) => {
  if(!req.user){
    res.redirect('/vmt/auth/login');
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
  res.redirect('/vmt/');
});

// auth with Ion
router.get('/auth/ion', passport.authenticate('ion', {
  scope: 'read'
}));

// callback route for Ion to redirect to
// hand control to passport to use code to grab profile info
router.get('/auth/ion/redirect', passport.authenticate('ion', { failureRedirect: '/vmt/auth/login'}), (req, res) => {
  res.redirect('/vmt/');
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
router.get('/rankings/test', (req, res) => {
  res.locals.metaTags = {
    title: 'Test Rankings',
  };
  res.render('rankings_choose_test');
});

router.get('/rankings/test/view', async (req, res) => {
  res.locals.metaTags = {
    title: 'Test Rankings',
  };
  let ranks = await Ind.find({testName: req.query.name}).sort("-indexVal");
  var out = [];
  for(var i=0; i<ranks.length; i++) {
    let rank = ranks[i];
    let score = await Score.findOne({studentUsername: rank.studentUsername, testName: rank.testName});
    out.push({
      rank: rank.rank,
      studentName: rank.studentName,
      indexVal: rank.indexVal,
      gradYear: rank.studentGradYear,
      scoreDist: score.scoreDist
    });
  }
  res.render('rankings_view_test', {ranks: out, testName: req.query.name});
});

//Rankings
router.get('/rankings/contest', (req, res) => {
  res.locals.metaTags = {
    title: 'Contest Rankings',
  };
  res.render('rankings_choose_contest');
});

router.get('/rankings/contest/view', async (req, res) => {
  res.locals.metaTags = {
    title: 'Contest Rankings',
  };
  let ranks = await Ind.find({testName: req.query.name}).sort("-indexVal");
  var out = [];
  for(var i=0; i<ranks.length; i++) {
    let rank = ranks[i];
    let score = await Score.findOne({studentUsername: rank.studentUsername, testName: rank.testName});
    out.push({
      rank: rank.rank,
      studentName: rank.studentName,
      indexVal: rank.indexVal,
      gradYear: rank.studentGradYear
    });
  }
  res.render('rankings_view_contest', {ranks: out, testName: req.query.name});
});

module.exports = router;