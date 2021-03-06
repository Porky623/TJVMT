const Test = require('../models/test');
const flash = require('express-flash-notification');
const Score = require('../models/score');
const User = require('../models/user');
const Ind = require('../models/ind');
const RankPage = require('../models/rankpage');
const topAvgNum = 12;

let valid = function(scoreVal, scoreDist, numQuestions) {
  if(numQuestions!=scoreDist.length)
    return false;
  // var count=0;
  // for(var i=0; i<scoreDist.length; i++) {
  //   if(scoreDist[i]!='0') {
  //     count++;
  //   }
  // }
  // return count==scoreVal;
  return true;
};

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
      writersNames: [],
      numQuestions: req.body.numQuestions
    });
    await test.save();
    console.log('Test created!');
  }
  else {
    return req.flash({
      type: 'Warning',
      message: 'There already exists a test name '+req.body.name+'! Test not created.',
      redirect: req.app.get('prefix')+'officers'
    });
  }
  res.redirect(req.app.get('prefix')+'officers');
};

// exports.test_update_score_name = async(req,res) => {
//   res.locals.metaTags = {
//     title: 'Update/Add Score',
//   };
//   var testNames = [];
//   let allTests = await Test.find({});
//   for(var i=0; i<allTests.length; i++) {
//     await testNames.push(allTests[i].name);
//   }
//   res.render('update_score_name', { query: req.query, testName: testNames});
// };
//
// exports.test_update_score_name_post = async(req,res,next) => {
//   if(!(await Test.exists({name: req.body.name}))) {
//     return req.flash({
//       type: 'Warning',
//       message: 'There is no test named '+req.body.name+'.',
//       redirect: req.app.get('prefix')+'/test/update/score'
//     });
//   }
//   res.redirect(req.app.get('prefix')+'test/update/score/add?name='+req.body.name);
// };

exports.test_update_score = async(req,res) => {
  res.locals.metaTags = {
    title: 'Update/Add Score',
  };
  var testNames = [];
  let allTests = await Test.find({});
  for(var i=0; i<allTests.length; i++) {
    await testNames.push(allTests[i].name);
  }
  if(req.query.name)
    testNames=[req.query.name];
  res.render('update_score', {query: req.query, testName: testNames});
};

exports.test_update_score_post = async (req,res,next) => {
  var score;
  if(!(await Test.exists({name: req.body.name}))) {
    return req.flash({
      type: 'Warning',
      message: 'There is no test named '+req.body.name+'.',
      redirect: req.app.get('prefix')+'test/update/score/add'
    });
  }
  else if (!(await User.exists({username: req.body.username}))) {
    return req.flash({
      type: 'Warning',
      message: 'Cannot find student with username ' + req.body.username + '.',
      redirect: req.app.get('prefix')+'test/update/score/add?name='+req.body.name
    });
  }
  else {
    let test = await Test.findOne({name: req.body.name});
    if(!valid(req.body.scoreVal, req.body.scoreDist, test.numQuestions)){
      return req.flash({
        type: 'Warning',
        message: 'Score value does not match score distribution, or score distribution is not valid.',
        redirect: req.app.get('prefix')+'test/update/score/add?name='+req.body.name
      })
    }
    let student = await User.findOne({username: req.body.username});
    if (await Score.exists({studentUsername: req.body.username, testName: req.body.name})) {
      let sc = await Score.findOne({studentUsername: req.body.username, testName: req.body.name});
      sc.scoreVal = req.body.scoreVal;
      sc.scoreDist = req.body.scoreDist;
      sc.save();
      test.scores.push(sc._id);
    } else {
      score = new Score({
        studentName: student.firstName+' '+student.lastName,
        studentUsername: student.username,
        studentGradYear: student.gradYear,
        studentGrade: student.grade,
        testName: test.name,
        scoreVal: req.body.scoreVal,
        scoreDist: req.body.scoreDist
      });
      score.save();
      test.scores.push(score._id);
      test.save();
    }
  }
  res.redirect(req.app.get('prefix')+'test/update/score/add?name='+req.body.name);
  // res.redirect(req.app.get('prefix')+'test/update/score/add?name=' + req.query.name);
};

exports.test_update_indices = async(req,res) => {
  res.locals.metaTags = {
    title: 'Update Indices',
  };
  var testNames = [];
  let allTests = await Test.find({});
  for(var i=0; i<allTests.length; i++) {
    await testNames.push(allTests[i].name);
  }
  res.render('update_indices_test', {testName: testNames});
};

exports.test_update_indices_post = async (req,res,next) => {
  var enoughScores = true;
  if(!(await Test.exists({name: req.body.testName}))) {
    return req.flash({
      type: 'Warning',
      message: 'There is no test named '+req.body.testName+'.',
      redirect: req.app.get('prefix')+'/test/update/indices'
    });
  }
  else {
    let test = await Test.findOne({name: req.body.testName});
    await Ind.deleteMany({testName: test.name});
    await RankPage.deleteMany({testName: test.name});
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
        if(!(await Score.exists({studentName: writer.firstName+' '+writer.lastName,testName: test.name}))) {
          let score = new Score({
            studentName: writer.firstName + ' ' + writer.lastName,
            studentUsername: writer.username,
            studentGradYear: writer.gradYear,
            studentGrade: writer.grade,
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
            studentGrade: score.studentGrade,
            testName: score.testName,
            scoreDist: score.scoreDist,
            indexVal: 2000
          });
        } else {
          index = new Ind({
            studentName: score.studentName,
            studentUsername: score.studentUsername,
            studentGradYear: score.studentGradYear,
            studentGrade: score.studentGrade,
            testName: score.testName,
            indexVal: 2000 * score.scoreVal / topAvg,
            scoreDist: score.scoreDist
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
      let rankPage = new RankPage({testName: test.name});
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
        let rank = index;
        var rowClass;
        if(i%2==0) {
          rowClass = 'table-light';
        }
        else {
          rowClass = 'table-active';
        }
        await rankPage.out.push({
          rank: rank.rank,
          studentName: rank.studentName,
          indexVal: rank.indexVal,
          gradYear: rank.studentGradYear,
          grade: rank.studentGrade,
          scoreDist: rank.scoreDist,
          rowClass: rowClass,
        });
      }
      await rankPage.save();
    }
    if(!enoughScores) {
      return req.flash({
        type: 'Warning',
        message: 'Not enough scores entered into the test!',
        redirect: req.app.get('prefix')+'officers'
      });
    }
  }
  res.redirect(req.app.get('prefix')+'officers');
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

exports.update_weighted_scores = async(req, res) => {
  res.locals.metaTags = {
    title: 'Update/Add Weighted Score',
  };
  var testNames = [];
  let allTests = await Test.find({});
  for(var i=0; i<allTests.length; i++) {
    await testNames.push(allTests[i].name);
  }
  res.render('update_score_weighted', { query: req.query, testName: testNames});
};

exports.update_weighted_scores_post = async(req, res, next) => {
  var enoughScores = true;
  if(!(await Test.exists({name: req.body.name}))) {
    return req.flash({
      type: 'Warning',
      message: 'There is no test named '+req.body.name+'.',
      redirect: req.app.get('prefix')+'/test/update/indices'
    });
  }
  else {
    let test = await Test.findOne({name: req.body.name});
    test.indices = [];
    var scores = test.scores;
    if (scores.length < 1) {
      enoughScores = false;
    } else {
      let numCorrect = [];
      for(var i=0; i<test.numQuestions; i++) {
        numCorrect.push(0);
      }
      // for(var i=0; i<scores.length; i++) {
      //   for(var j=0; j<numCorrect.length; j++) {
      //     if(scores[i].scoreDist.charAt(j)!='0') {
      //       numCorrect[j]++;
      //     }
      //   }
      // }
      let weightings = req.body.weighting.split(",");
      if(weightings.length!=numCorrect.length) {
        return req.flash({
          type: "Warning",
          message: "The number of weightings does not match the number of questions.",
          redirect: req.app.get("prefix")+'test/update/weighted_score/add'
        });
      }
      for(var i=0; i<numCorrect.length; i++) {
        // if(numCorrect[i]>0)
        numCorrect[i]=parseFloat(weightings[i]);
        if(isNaN(numCorrect[i]))
          return req.flash({
            type: "Warning",
            message: "Invalid weighting found at index "+i,
            redirect: req.app.get("prefix")+'test/update/weighted_score/add'
          });
      }
      for(var i=0; i<scores.length; i++) {
        let score = await Score.findById(scores[i]);
        if(score.scoreDist=="Writer")
          continue;
        var totalScore = 0;
        for(var j=0; j<numCorrect.length; j++) {
          if(score.scoreDist.charAt(j)!='0') {
            totalScore+=numCorrect[j];
          }
        }
        score.scoreVal = totalScore;
        await score.save();
      }
    }
    // if(!enoughScores) {
    //   return req.flash({
    //     type: 'Warning',
    //     message: 'At least one score must be entered!',
    //     redirect: req.app.get('prefix')+'officers'
    //   });
    // }
  }
  res.redirect(req.app.get('prefix')+'officers');
};