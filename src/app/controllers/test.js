const Test = require('../models/test');
const flash = require('express-flash-notification');
const Score = require('../models/score');
const User = require('../models/user');
const Index = require('../models/index');
const topAvgNum = 12;

exports.test_create = async(req,res) => {
  res.locals.metaTags = {
    title: 'Add Test',
  };
  res.render('add_test', { user: req.user });
};

exports.test_create_post = async (req,res,next) => {
  if(!(await Test.exists({name: req.body.name}))) {
    var test = new Test({
      name: req.body.name
    });
    test.save(function(err,test) {
      if(err) return next(err);
      console.log('Test created!');
    });
  }
  else {
    req.flash({
      type: 'Warning',
      message: 'There already exists a test name '+req.body.name+'! Test not created.',
      redirect: false
    });
  }
  res.redirect('/officers');
};

exports.test_update_score_name = async(req,res) => {
  res.locals.metaTags = {
    title: 'Update/Add Score',
  };
  res.render('update_score_name', { user: req.user });
};

exports.test_update_score_name_post = async(req,res,next) => {
  if(!(await Test.exists({name: req.body.name}))) {
    req.flash({
      type: 'Warning',
      message: 'There is no test named '+req.body.name+'.',
      redirect: false
    });
    res.redirect('/test/update/score');
  }
  else {
    res.redirect('/test/update/score/add?name='+req.body.name);
  }
};

exports.test_update_score = async(req,res) => {
  res.locals.metaTags = {
    title: 'Update/Add Score',
  };
  res.render('update_score', { user: req.user, query: req.query});
};

exports.test_update_score_post = async (req,res,next) => {
  var score;
  if(!(await Test.exists({name: req.query.name}))) {
    req.flash({
      type: 'Warning',
      message: 'There is no test named '+req.query.name+'.',
      redirect: '/test/update/score'
    });
  }
  else if (!(await User.exists({username: req.body.username}))) {
    req.flash({
      type: 'Warning',
      message: 'Cannot find student with username ' + req.body.username + '.',
      redirect: false
    });
    res.redirect('/test/update/score/add?name=' + req.query.name);
  }
  else {
    await Test.findOne({name: req.query.name}, async (err, test) => {
      console.log(test.scores[0]);
      await User.findOne({username: req.body.username},
          async (err, student) => {
            if (err) {
              next(err);
            }
            if (Score.exists({student: student._id, test: test._id})) {
              await Score.findOne({student: student._id, test: test._id},
                  async (err, sc) => {
                    sc.student = student._id;
                    sc.test = test._id;
                    sc.scoreVal = req.body.scoreVal;
                    sc.scoreDist = req.body.scoreDist;
                    sc.save();
                    test.scores.push(sc._id);
                  });
            } else {
              score = new Score({
                student: student._id,
                test: test._id,
                scoreVal: req.body.scoreVal,
                scoreDist: req.body.scoreDist
              });
              score.save();
              test.scores.push(score._id);
              test.save();
            }
          });
      console.log(test.scores[0]);
    });
    res.redirect('/test/update/score/add?name=' + req.query.name);
  }
};

exports.test_update_indices = async(req,res) => {
  res.locals.metaTags = {
    title: 'Update Indices',
  };
  res.render('update_indices_test', {user: req.user});
};

exports.test_update_indices_post = async (req,res,next) => {
  var enoughScores = true;
  if(!(await Test.exists({name: req.body.testName}))) {
    req.flash({
      type: 'Warning',
      message: 'There is no test named '+req.body.testName+'.',
      redirect: false
    });
    res.redirect('/test/update/indices');
  }
  else {
    await Test.findOne({name: req.body.testName}, async(err, test) => {
      var scores = test.scores;
      if(err) {
        next(err);
      }
      if(scores.length<topAvgNum) {
        enoughScores = false;
      }
      else {
        //Sorts in decreasing scoreVal order
        scores.sort(function(score1id,score2id) {
          let s1 = Score.findById(score1id);
          let val1 = s1.scoreVal;
          let s2 = Score.findById(score2id);
          let val2 = s2.scoreVal;
          if(val1 != val2) {
            return val2-val1;
          }
          else {
            return User.findById(s2.student).username-User.findById(s1.student).username;
          }
        });
        var topAvg = 0;
        for(var i=0; i<topAvgNum; i++) {
          let v = Score.findById(scores[i]).scoreVal;
          topAvg+=v;
        }
        topAvg/=topAvgNum;
        for(var i=0; i<scores.length; i++) {
          let score = Score.findById(scores[i]);
          let index = new Index({
            student: score.student,
            test: test._id,
            indexVal: 2000*score.scoreVal/topAvg
          });
          index.save();
          test.indices.push(index._id);
          test.save();
        }
      }
    })
  }
  if(!enoughScores) {
    req.flash({
      type: 'Warning',
      message: 'Not enough scores entered into the test!',
      redirect: false
    });
    res.redirect('/test/update/indices');
  }
  else {
    res.redirect('/test/update/indices');
  }
};