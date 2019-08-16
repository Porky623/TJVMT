const Contest = require('../models/contest');
const TestWeight = require('../models/testWeighting');
const Test = require('../models/test');
const flash = require('express-flash-notification');

exports.contest_create = async(req,res) => {
  res.locals.metaTags = {
    title: 'Add Contest',
  };
  res.render('add_contest', { user: req.user });
};

exports.contest_create_post = async (req,res,next) => {
  if(!(await Contest.exists({name: req.body.name}))) {
    var contest = new Contest({
      name: req.body.name
    });
    contest.save(function(err,contest) {
      if(err) return next(err);
      console.log('Contest created!');
    });
  }
  else {
    req.flash({
      type: 'Warning',
      message: 'There already exists a contest name '+req.body.name+'! Contest not created.',
      redirect: false
    });
  }
  res.redirect('/officers');
};

//Select which contest to update
exports.contest_update_tests_name = function(req,res) {
  res.locals.metaTags = {
    title: 'Select Contest',
  };
  res.render('update_contest_test_name', {user: req.user});
};

exports.contest_update_tests_add = async (req,res) => {
  res.locals.metaTags = {
    title: 'Input Weight',
  };
  if(!(await Contest.exists({name: req._parsedOriginalUrl.query.substring(5)}))) {
    req.flash({
      type: 'Warning',
      message: 'There is no contest name '+req._parsedOriginalUrl.query.substring(5),
      redirect: false
    });
    res.redirect('/contest/update/test');
  }
  else {
    res.render('update_contest_test_add',
        {user: req.user, query: req._parsedOriginalUrl.query});
  }
};

exports.contest_update_tests_add_post = async (req,res,next) => {
  var weight;
  await Test.findOne({name: req.body.testName}, function(err, test) {
    if(err){
      next(err);
    }
    weight = new TestWeight({
      contestName: req.query.name,
      testId: test._id,
      weighting: req.body.testWeight
    });
    weight.save();
    weight.populate('testId');
  });
  await Contest.findOne({name: req.query.name}, async (error, contest) => {
    if(error){
      next(error);
    }
    await Test.findOne({name: req.body.testName}, function(err, test) {
      if(err) {
        next(err);
      }
      contest.tests.push(test._id);
      contest.populate('tests');
    });
    contest.weighting.push(weight._id);
    contest.save();
  });
  res.redirect('/contest/update/test/add?name='+req.query.name);
};