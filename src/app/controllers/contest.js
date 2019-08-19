const Contest = require('../models/contest');
const TestWeight = require('../models/testWeighting');
const Test = require('../models/test');
const Ind = require('../models/ind');
const User = require('../models/user');
const prefix = require('../../config/url-config').prefix;
const flash = require('express-flash-notification');

exports.contest_create = async(req,res) => {
  res.locals.metaTags = {
    title: 'Add Contest',
  };
  res.render('add_contest');
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
  res.redirect(prefix+'officers');
};

//Select which contest to update
exports.contest_update_tests_name = function(req,res) {
  res.locals.metaTags = {
    title: 'Select Contest',
  };
  res.render('update_contest_test_name');
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
    res.redirect(prefix+'contest/update/test');
  }
  else {
    res.render('update_contest_test_add',
        { query: req._parsedOriginalUrl.query});
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
  res.redirect(prefix+'contest/update/test/add?name='+req.query.name);
};

exports.contest_update_indices = async (req, res) => {
  res.locals.metaTags = {
    title: 'Update Indices',
  };
  res.render('update_indices_contest');
};

exports.contest_update_indices_post = async (req, res, next) => {
  if(!(await Contest.exists({name: req.body.contestName}))) {
    req.flash({
      type: 'Warning',
      message: 'There is no contest named '+req.body.contestName+'.',
      redirect: false
    });
  }
  else {
    let contest = await Contest.findOne({name: req.body.contestName});
    await Ind.deleteMany({name: contest.name});
    let conIndices = new Map();
    for (var i = 0; i < contest.weighting.length; i++) {
      let weighting = await TestWeight.findById(contest.weighting[i]);
      let test = await Test.findById(weighting.testId);
      for (var j = 0; j < test.indices.length; j++) {
        let index = await Ind.findById(test.indices[j]);
        let weightedInd = index.indexVal*weighting.weighting;
        if (!conIndices.has(index.studentUsername)) {
          conIndices.set(index.studentUsername, 0);
        }
        conIndices.set(index.studentUsername,
            conIndices.get(index.studentUsername) + weightedInd);
      }
    }
    for (var [studentUsername, indValue] of conIndices) {
      let student = await User.findOne({username: studentUsername});
      let ind = new Ind({
        studentName: student.firstName + ' ' + student.lastName,
        studentUsername: studentUsername,
        studentGradYear: student.gradYear,
        testName: req.body.contestName,
        indexVal: indValue
      });
      await ind.save();
      contest.indices.push(ind._id);
      await contest.save();
    }
    var last, lastRank = 1;
    let indices = await Ind.find({testName: req.body.contestName}).
        sort("-indexVal");
    for (var i = 0; i < indices.length; i++) {
      index = indices[i];
      if (i == 0) {
        last = index.indexVal;
      }
      if (index.indexVal == last) {
        index.rank = lastRank;
      } else {
        last = index.indexVal;
        lastRank = i + 1;
        index.rank = lastRank;
      }
      await index.save();
    }
  }
  res.redirect(prefix+'officers');
};