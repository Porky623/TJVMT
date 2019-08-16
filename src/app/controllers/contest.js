const Contest = require('../models/contest');
const TestWeight = require('../models/testWeighting');

exports.contest_create_post = function (req,res,next) {
  if(!Contest.exists({name: req.body.name})) {
    var contest = new Contest({
      name: req.body.name
    });
    contest.save(function(err,contest) {
      if(err) return next(err);
      console.log('Contest created!');
    });
  }
  res.redirect('/officers');
};

//Select which contest to update
exports.contest_update_tests_name = function(req,res) {
  res.render('update_contest_test_name', {user: req.user});
};

exports.contest_update_tests_add = function(req,res) {
  res.render('update_contest_test_add', {user: req.user, query: req._parsedOriginalUrl.query});
};

exports.contest_update_tests_add_post = function(req,res,next) {
  let weight = new TestWeight({
    contestName: req.query.name,
    testId: req.body.testName,
    weighting: req.body.testWeight
  });
  weight.save();
  Contest.findOne({name: req.query.name}, function(error, contest) {
    if(error){
      next(error);
    }
    contest.tests.push(req.body.testName);
    contest.weighting.push(weight._id);
    contest.save();
  });
  res.redirect('/contest/update/test/add?name='+req.query.name);
};