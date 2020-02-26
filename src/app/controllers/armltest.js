const ARMLTest = require('../models/armltest');
const flash = require('express-flash-notification');
const Score = require('../models/score');
const ARMLScore = require('../models/armlscore');
const ARMLTeam = require('../models/armlteam');
const ARMLRelay = require('../models/armlrelay');
const User = require('../models/user');
const Ind = require('../models/ind');
const RankPage = require('../models/rankpage');
const topAvgNum = 12;
const indivWeight = 0.7;
const TeamWeight = 0.2;
const RelayWeight = 0.1;

let valid = function (scoreVal, scoreDist, numQuestions) {
    if (numQuestions != scoreDist.length)
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

exports.test_create = async (req, res) => {
    res.locals.metaTags = {
        title: 'Add ARML Test',
    };
    res.render('add_arml_test');
};

exports.test_create_post = async (req, res, next) => {
    if (!(await ARMLTest.exists({name: req.body.name}))) {
        var test = new ARMLTest({
            name: req.body.name,
            numQuestions: 8
        });
        await test.save();
        console.log('ARML Test created!');
    } else {
        return req.flash({
            type: 'Warning',
            message: 'There already exists an ARML test named ' + req.body.name + '! Test not created.',
            redirect: req.app.get('prefix') + 'officers'
        });
    }
    res.redirect(req.app.get('prefix') + 'officers');
};

exports.test_update_score = async (req, res) => {
    res.locals.metaTags = {
        title: 'Update/Add Score',
    };
    var testNames = [];
    let allTests = await ARMLTest.find({});
    for (var i = 0; i < allTests.length; i++) {
        await testNames.push(allTests[i].name);
    }
    if (req.query.name)
        testNames = [req.query.name];
    res.render('update_arml_score', {query: req.query, testName: testNames});
};

exports.test_update_score_post = async (req, res, next) => {
    var score;
    if (!(await ARMLTest.exists({name: req.body.name}))) {
        return req.flash({
            type: 'Warning',
            message: 'There is no ARML test named ' + req.body.name + '.',
            redirect: req.app.get('prefix') + 'armltest/update/score/add'
        });
    } else if (!(await User.exists({username: req.body.username}))) {
        return req.flash({
            type: 'Warning',
            message: 'Cannot find student with username ' + req.body.username + '.',
            redirect: req.app.get('prefix') + 'armltest/update/score/add?name=' + req.body.name
        });
    } else {
        let test = await ARMLTest.findOne({name: req.body.name});
        if (!valid(req.body.scoreVal, req.body.scoreDist, 8)) {
            return req.flash({
                type: 'Warning',
                message: 'Score value does not match score distribution, or score distribution is not valid.',
                redirect: req.app.get('prefix') + 'armltest/update/score/add?name=' + req.body.name
            })
        }
        let student = await User.findOne({username: req.body.username});
        if (await ARMLScore.exists({studentUsername: req.body.username, testName: req.body.name})) {
            let sc = await Score.findOne({studentUsername: req.body.username, testName: req.body.name});
            sc.indivScore = req.body.scoreVal;
            sc.indivScoreDist = req.body.scoreDist;
            sc.scoreVal = sc.indivScore * indivWeight + sc.teamScore * teamWeight + sc.relayScore * teamWeight;
            sc.save();
        } else {
            score = new Score({
                studentName: student.firstName + ' ' + student.lastName,
                studentUsername: student.username,
                studentGradYear: student.gradYear,
                studentGrade: student.grade,
                testName: test.name,
                indivScore: req.body.scoreVal,
                indivScoreDist: req.body.scoreDist,
                teamScore: 0,
                relayScore: 0,
                scoreVal: req.body.scoreVal * indivWeight
            });
            score.save();
            test.scores.push(score._id);
            test.save();
        }
    }
    res.redirect(req.app.get('prefix') + 'armltest/update/score/add?name=' + req.body.name)
};

exports.test_update_team = async (req, res) => {
    res.locals.metaTags = {
        title: 'Update/Add Team',
    };
    var testNames = [];
    let allTests = await ARMLTest.find({});
    for (var i = 0; i < allTests.length; i++) {
        await testNames.push(allTests[i].name);
    }
    if (req.query.name)
        testNames = [req.query.name];
    res.render('update_arml_team', {query: req.query, testName: testNames});
};

exports.test_update_team_post = async (req, res) => {
    var score;
    if (!(await ARMLTest.exists({name: req.body.name}))) {
        return req.flash({
            type: 'Warning',
            message: 'There is no ARML test named ' + req.body.name + '.',
            redirect: req.app.get('prefix') + 'armltest/update/team/add'
        });
    } else {
        let members = req.body.members.split(",");
        for (var i = 0; i < members.length; i++) {
            if (!(await User.exists({username: members[i]}))) {
                return req.flash({
                    type: 'Warning',
                    message: 'Cannot find student with username ' + members[i] + '.',
                    redirect: req.app.get('prefix') + 'armltest/update/team/add?name=' + req.body.name
                });
            }
        }
        let test = await ARMLTest.findOne({name: req.body.name});
        if (!valid(req.body.scoreVal, req.body.scoreDist, 10)) {
            return req.flash({
                type: 'Warning',
                message: 'Score value does not match score distribution, or score distribution is not valid.',
                redirect: req.app.get('prefix') + 'armltest/update/team/add?name=' + req.body.name
            })
        }
        let team = new ARMLTeam ({
            name: req.body.teamname,
            testName: req.body.name,
            members: members,
            scoreVal: req.body.scoreVal,
            scoreDist: req.body.scoreDist
        });
        await team.save();
        test.teams.push(team._id);
        await test.save();
        for(var i = 0; i<members.length; i++) {
            let student = await User.findOne({username: members[i]});
            if (await ARMLScore.exists({studentUsername: members[i], testName: req.body.name})) {
                let sc = await Score.findOne({studentUsername: members[i], testName: req.body.name});
                sc.teamScore = req.body.scoreVal;
                sc.scoreVal = sc.indivScore * indivWeight + sc.teamScore * teamWeight + sc.relayScore * teamWeight;
                sc.save();
            } else {
                score = new Score({
                    studentName: student.firstName + ' ' + student.lastName,
                    studentUsername: student.username,
                    studentGradYear: student.gradYear,
                    studentGrade: student.grade,
                    testName: test.name,
                    indivScore: 0,
                    indivScoreDist: "00000000",
                    teamScore: req.body.scoreVal,
                    relayScore: 0,
                    scoreVal: req.body.scoreVal * teamWeight
                });
                score.save();
                test.scores.push(score._id);
                test.save();
            }
        }
    }
    res.redirect(req.app.get('prefix') + 'armltest/update/team/add?name=' + req.body.name)
};

exports.test_update_relay = async (req, res) => {
    res.locals.metaTags = {
        title: 'Update/Add Relay',
    };
    var testNames = [];
    let allTests = await ARMLTest.find({});
    for (var i = 0; i < allTests.length; i++) {
        await testNames.push(allTests[i].name);
    }
    if (req.query.name)
        testNames = [req.query.name];
    res.render('update_arml_relay', {query: req.query, testName: testNames});
};

exports.test_update_relay_post = async (req, res) => {
    var score;
    if (!(await ARMLTest.exists({name: req.body.name}))) {
        return req.flash({
            type: 'Warning',
            message: 'There is no ARML test named ' + req.body.name + '.',
            redirect: req.app.get('prefix') + 'armltest/update/relay/add'
        });
    } else {
        let members = req.body.members.split(",");
        for (var i = 0; i < members.length; i++) {
            if (!(await User.exists({username: members[i]}))) {
                return req.flash({
                    type: 'Warning',
                    message: 'Cannot find student with username ' + members[i] + '.',
                    redirect: req.app.get('prefix') + 'armltest/update/relay/add?name=' + req.body.name
                });
            }
        }
        let test = await ARMLTest.findOne({name: req.body.name});
        if (!valid(req.body.scoreVal, req.body.scoreDist, 10)) {
            return req.flash({
                type: 'Warning',
                message: 'Score value does not match score distribution, or score distribution is not valid.',
                redirect: req.app.get('prefix') + 'armltest/update/relay/add?name=' + req.body.name
            })
        }
        let relay = new ARMLRelay ({
            name: req.body.relayname,
            testName: req.body.name,
            members: members,
            scoreVal: req.body.scoreVal,
            scoreDist: req.body.scoreDist
        });
        await relay.save();
        test.relays.push(relay._id);
        await test.save();
        for(var i = 0; i<members.length; i++) {
            let student = await User.findOne({username: members[i]});
            if (await ARMLScore.exists({studentUsername: members[i], testName: req.body.name})) {
                let sc = await Score.findOne({studentUsername: members[i], testName: req.body.name});
                sc.relayScore = req.body.scoreVal;
                sc.scoreVal = sc.indivScore * indivWeight + sc.teamScore * teamWeight + sc.relayScore * teamWeight;
                sc.save();
            } else {
                score = new Score({
                    studentName: student.firstName + ' ' + student.lastName,
                    studentUsername: student.username,
                    studentGradYear: student.gradYear,
                    studentGrade: student.grade,
                    testName: test.name,
                    indivScore: 0,
                    indivScoreDist: "00000000",
                    teamScore: 0,
                    relayScore: req.body.scoreVal,
                    scoreVal: req.body.scoreVal * relayWeight
                });
                score.save();
                test.scores.push(score._id);
                test.save();
            }
        }
    }
    res.redirect(req.app.get('prefix') + 'armltest/update/relay/add?name=' + req.body.name)
};


exports.test_update_indices = async (req, res) => {
    res.locals.metaTags = {
        title: 'Update Indices',
    };
    var testNames = [];
    let allTests = await ARMLTest.find({});
    for (var i = 0; i < allTests.length; i++) {
        await testNames.push(allTests[i].name);
    }
    res.render('update_indices_arml_test', {testName: testNames});
};

exports.test_update_indices_post = async (req, res, next) => {
    var enoughScores = true;
    if (!(await ARMLTest.exists({name: req.body.testName}))) {
        return req.flash({
            type: 'Warning',
            message: 'There is no ARML test named ' + req.body.testName + '.',
            redirect: req.app.get('prefix') + 'armltest/update/indices'
        });
    } else {
        let test = await ARMLTest.findOne({name: req.body.testName});
        await Ind.deleteMany({testName: test.name});
        await RankPage.deleteMany({testName: test.name});
        test.indices = [];
        var scores = test.scores;
        if (scores.length < topAvgNum) {
            enoughScores = false;
        } else {
            var topAvg = 0;
            var query = await ARMLScore.find({testName: test.name}).sort("-scoreVal");
            for (var i = 0; i < topAvgNum; i++) {
                topAvg = topAvg + query[i].scoreVal;
            }
            topAvg = topAvg / topAvgNum;
            for (var i = 0; i < scores.length; i++) {
                let score = query[i];
                var index;
                index = new Ind({
                    studentName: score.studentName,
                    studentUsername: score.studentUsername,
                    studentGradYear: score.studentGradYear,
                    studentGrade: score.studentGrade,
                    testName: score.testName,
                    indexVal: 2000 * score.scoreVal / topAvg,
                    scoreDist: score.scoreDist
                });
                await index.save();
                await test.indices.push(index._id);
                await test.save();
            }
            var last, lastRank = 1;
            indices = await Ind
                .find({testName: test.name})
                .sort("-indexVal");
            let rankPage = new RankPage({testName: test.name});
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
                let rank = index;
                var rowClass;
                if (i % 2 == 0) {
                    rowClass = 'table-light';
                } else {
                    rowClass = 'table-active';
                }
                await rankPage.out.push({
                    rank: rank.rank,
                    studentName: rank.studentName,
                    indexVal: rank.indexVal,
                    gradYear: rank.studentGradYear,
                    grade: rank.studentGrade,
                    scoreDist: rank.indivScoreDist,
                    rowClass: rowClass,
                });
            }
            await rankPage.save();
        }
        if (!enoughScores) {
            return req.flash({
                type: 'Warning',
                message: 'Not enough scores entered into the test!',
                redirect: req.app.get('prefix') + 'officers'
            });
        }
    }
    res.redirect(req.app.get('prefix') + 'officers');
};