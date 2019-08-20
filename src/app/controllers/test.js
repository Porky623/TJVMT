const Test = require('../models/test');
const flash = require('express-flash-notification');
const Score = require('../models/score');
const User = require('../models/user');
const Ind = require('../models/ind');
const topAvgNum = 12;

exports.test_create = async(req,res) => {
  res.locals.metaTags = {
    title: 'Add Test',
  };
  res.render('add_test');
};

exports.test_create_post = async (req,res,next) => {
  if(!(await Test.exists({name: req.body.name}))) {
    var test = new Test({
      name: req.body.name,
      writersNames: []
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
  res.redirect(req.app.get('prefix')+'officers');
};

exports.test_update_score_name = async(req,res) => {
  res.locals.metaTags = {
    title: 'Update/Add Score',
  };
  res.render('update_score_name');
};

exports.test_update_score_name_post = async(req,res,next) => {
  if(!(await Test.exists({name: req.body.name}))) {
    req.flash({
      type: 'Warning',
      message: 'There is no test named '+req.body.name+'.',
      redirect: false
    });
    res.redirect(req.app.get('prefix')+'/test/update/score');
  }
  else {
    res.redirect(req.app.get('prefix')+'test/update/score/add?name='+req.body.name);
  }
};

exports.test_update_score = async(req,res) => {
  res.locals.metaTags = {
    title: 'Update/Add Score',
  };
  res.render('update_score', { query: req.query});
};

exports.test_update_score_post = async (req,res,next) => {
  var score;
  if(!(await Test.exists({name: req.query.name}))) {
    req.flash({
      type: 'Warning',
      message: 'There is no test named '+req.query.name+'.',
      redirect: req.app.get('prefix')+'test/update/score'
    });
  }
  else if (!(await User.exists({username: req.body.username}))) {
    req.flash({
      type: 'Warning',
      message: 'Cannot find student with username ' + req.body.username + '.',
      redirect: false
    });
    res.redirect(req.app.get('prefix')+'test/update/score/add?name=' + req.query.name);
  }
  else {
    let test = await Test.findOne({name: req.query.name});
    let student = await User.findOne({username: req.body.username});
    if (await Score.exists({studentUsername: req.body.username, testName: req.query.name})) {
      await Score.findOne({studentUsername: req.body.username, testName: req.query.name},
          async (err, sc) => {
            sc.scoreVal = req.body.scoreVal;
            sc.scoreDist = req.body.scoreDist;
            sc.save();
            test.scores.push(sc._id);
          });
    } else {
      score = new Score({
        studentName: student.firstName+' '+student.lastName,
        studentUsername: student.username,
        studentGradYear: student.gradYear,
        testName: test.name,
        scoreVal: req.body.scoreVal,
        scoreDist: req.body.scoreDist
      });
      score.save();
      test.scores.push(score._id);
      test.save();
    }
    res.redirect(req.app.get('prefix')+'test/update/score/add?name=' + req.query.name);
  }
};

exports.test_update_indices = async(req,res) => {
  res.locals.metaTags = {
    title: 'Update Indices',
  };
  res.render('update_indices_test');
};

exports.test_update_indices_post = async (req,res,next) => {
  var enoughScores = true;
  if(!(await Test.exists({name: req.body.testName}))) {
    req.flash({
      type: 'Warning',
      message: 'There is no test named '+req.body.testName+'.',
      redirect: false
    });
    res.redirect(req.app.get('prefix')+'/test/update/indices');
  }
  else {
    let test = await Test.findOne({name: req.body.testName});
    await Ind.deleteMany({testName: test.name});
    test.indices = [];
    var scores = test.scores;
    if (scores.length < topAvgNum) {
      enoughScores = false;
    } else {
      var topAvg = 0;
      var query = await Score.
          find({testName: test.name}).
          sort("-scoreVal");
      for (var i = 0; i < topAvgNum; i++) {
        topAvg = topAvg + query[i].scoreVal;
      }
      topAvg = topAvg / topAvgNum;
      for(var i=0; i<test.writersNames.length; i++) {
        let writer = await User.findOne({username: test.writersNames[i]});
        if(!(await Score.exists({studentName: writer.firstName+' '+writer.lastName}))) {
          let score = new Score({
            studentName: writer.firstName + ' ' + writer.lastName,
            studentUsername: writer.username,
            studentGradYear: writer.gradYear,
            testName: test.name,
            scoreVal: 0,
            scoreDist: 'Writer'
          });
          await score.save();
          test.scores.push(score._id);
          await test.save();
        }
      }
      query = await Score.
          find({testName: test.name}).
          sort("-scoreVal");
      for (var i = 0; i < scores.length; i++) {
        let score = query[i];
        var index;
        if (score.scoreDist.trim() == 'Writer') {
          index = new Ind({
            studentName: score.studentName,
            studentUsername: score.studentUsername,
            studentGradYear: score.studentGradYear,
            testName: score.testName,
            indexVal: 2000
          });
        } else {
          index = new Ind({
            studentName: score.studentName,
            studentUsername: score.studentUsername,
            studentGradYear: score.studentGradYear,
            testName: score.testName,
            indexVal: 2000 * score.scoreVal / topAvg
          });
        }
        await index.save();
        await test.indices.push(index._id);
        await test.save();
      }
      var last, lastRank=1;
      indices = await Ind
          .find({testName: test.name})
          .sort("-indexVal");
      for(var i=0; i<indices.length; i++) {
        index = indices[i];
        if(i==0) {
          last=index.indexVal;
        }
        if(index.indexVal==last) {
          index.rank=lastRank;
        }
        else {
          last=index.indexVal;
          lastRank=i+1;
          index.rank=lastRank;
        }
        await index.save();
      }
    }
    if(!enoughScores) {
      req.flash({
        type: 'Warning',
        message: 'Not enough scores entered into the test!',
        redirect: false
      });
    }
    res.redirect(req.app.get('prefix')+'officers');
  }
};

exports.test_writer = async(req, res) => {
  res.locals.metaTags = {
    title: 'Add Writer',
  };
  res.render('add_writer', { query: req.query});
};

exports.test_writer_post = async(req, res, next) => {
  if(!(await Test.exists({name: req.body.testName}))) {
      req.flash({
          type: 'Warning',
          message: 'Could not find test named '+req.body.testName,
          redirect: req.app.get('prefix')+'test/update/writer'
      })
  }
  else {
      let test = await Test.findOne({name: req.body.testName});
      var inTest = false;
      for(var i=0; i<test.writersNames.length; i++) {
        if(test.writersNames[i]==req.body.username) {
          inTest = true;
          break;
        }
      }
      if(inTest) {
        req.flash({
          type: 'Warning',
          message: 'Writer already in test! Writer not added',
          redirect: req.app.get('prefix')+'test/update/writer'
        });
      }
      else if(!(await User.exists({username: req.body.username}))) {
        req.flash({
            type: 'Warning',
            message: 'There is no student with username '+req.body.username,
            redirect: req.app.get('prefix')+'test/update/writer'
        })
      }
      else {
        let writer = await User.findOne({username: req.body.username});
        await test.writersNames.push(writer.username);
        await test.save();
        res.redirect(req.app.get('prefix')+'test/update/writer');
      }
  }
};