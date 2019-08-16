const express = require('express');
const router = express.Router();
const passport = require('passport');

const authCheck = (req, res, next) => {
  if(!req.user){
    res.redirect('/auth/login');
  } else {
    next();
  }
};

// auth login
router.get('/auth/login', (req, res) => {
  res.render('login', { user: req.user });
});

// auth logout
router.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// auth with Ion
router.get('/auth/ion', passport.authenticate('ion', {
  scope: 'read'
}));

// callback route for Ion to redirect to
// hand control to passport to use code to grab profile info
router.get('/auth/ion/redirect', passport.authenticate('ion', { failureRedirect: '/auth/login'}), (req, res) => {
  res.redirect('/');
});

//Home page
router.get('/', (req, res) => {
  res.locals.metaTags = {
    title: 'TJ VMT',
  };
  res.render('index', { user: req.user });
});

//Calendar
router.get('/calendar', (req, res) => {
  res.locals.metaTags = {
    title: 'Schedule',
  };
  res.render('calendar', { user: req.user });
});

//TJIMO
router.get('/tjimo', (req, res) => {
  res.locals.metaTags = {
    title: 'TJIMO',
  };
  res.render('tjimo', { user: req.user });
});

//About
router.get('/about', (req, res) => {
  res.locals.metaTags = {
    title: 'About TJ VMT',
  };
  res.render('about', { user: req.user });
});

//Archive
router.get('/archive', (req, res) => {
  res.locals.metaTags = {
    title: 'Archive',
  };
  res.render('archive', { user: req.user });
});

//Rankings
router.get('/rankings', (req, res) => {
  res.locals.metaTags = {
    title: 'Rankings',
  };
  res.render('rankings', { user: req.user });
});

module.exports = router;