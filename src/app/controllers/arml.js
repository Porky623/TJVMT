const ARMLTest = require('../models/armlTest');
const flash = require('express-flash-notification');
const ARMLScore = require('../models/armlScore');
const ARMLRelay = require('../models/armlRelay');
const ARMLTeam = require('../models/armlTeam');
const User = require('../models/user');
const Ind = require('../models/ind');
const RankPage = require('../models/rankpage');
const topAvgNum = 15;

let valid = function (scoreVal, scoreDist, numQuestions) {
    // if (numQuestions != scoreDist.length)
    //     return false;
    return true;
};

exports.arml_test_create = async (req, res) => {
    res.locals.metaTags = {
        title: 'Add Test',
    };
    res.render('add_arml_test');
};

exports.arml_test_create_post = async (req, res, next) => {
    if (!(await ARMLTest.exists({name: req.body.name}))) {
        var test = new ARMLTest({
            name: req.body.name,
        });
        await test.save();
        console.log('ARML Test created!');
    } else {
        return req.flash({
            type: 'Warning',
            message: 'There already exists an ARML test name ' + req.body.name + '! Test not created.',
            redirect: req.app.get('prefix') + 'officers'
        });
    }
    res.redirect(req.app.get('prefix') + 'officers');
};

exports.arml_test_update_indiv_score = async (req, res) => {
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
    res.render('update_arml_indiv_score', {query: req.query, testName: testNames});
};

exports.arml_test_update_indiv_score_post = async (req, res, next) => {
    var score;
    if (!(await ARMLTest.exists({name: req.body.name}))) {
        return req.flash({
            type: 'Warning',
            message: 'There is no ARML test named ' + req.body.name + '.',
            redirect: req.app.get('prefix') + 'test/arml/update/score/add'
        });
    } else if (!(await User.exists({username: req.body.username}))) {
        return req.flash({
            type: 'Warning',
            message: 'Cannot find student with username ' + req.body.username + '.',
            redirect: req.app.get('prefix') + 'test/arml/update/score/add?name=' + req.body.name
        });
    } else {
        let test = await ARMLTest.findOne({name: req.body.name});
        if (!valid(req.body.scoreVal, req.body.scoreDist, 8)) {
            return req.flash({
                type: 'Warning',
                message: 'Score value does not match score distribution, or score distribution is not valid.',
                redirect: req.app.get('prefix') + 'test/arml/update/score/add?name=' + req.body.name
            })
        }
        let student = await User.findOne({username: req.body.username});
        if (await ARMLScore.exists({studentUsername: req.body.username, testName: req.body.name})) {
            let sc = await ARMLScore.findOne({studentUsername: req.body.username, testName: req.body.name});
            sc.indScore = req.body.scoreVal;
            sc.scoreDist = req.body.scoreDist;
            sc.scoreVal = sc.teamScore * 0.2 + sc.relayScore * 0.1 + req.body.scoreVal * 0.7;
            sc.save();
        } else {
            score = new ARMLScore({
                studentName: student.firstName + ' ' + student.lastName,
                studentUsername: student.username,
                studentGradYear: student.gradYear,
                studentGrade: student.grade,
                testName: test.name,
                indScore: req.body.scoreVal,
                scoreDist: req.body.scoreDist,
                teamScore: 0,
                relayScore: 0,
                scoreVal: req.body.scoreVal * 0.7
            });
            score.save();
            test.scores.push(score._id);
            test.save();
        }
    }
    res.redirect(req.app.get('prefix') + 'test/arml/update/score/add?name=' + req.body.name);
};

exports.arml_test_update_team_score = async (req, res) => {
    res.locals.metaTags = {
        title: 'Update/Add Team Score',
    };
    var testNames = [];
    let allTests = await ARMLTest.find({});
    for (var i = 0; i < allTests.length; i++) {
        await testNames.push(allTests[i].name);
    }
    if (req.query.name)
        testNames = [req.query.name];
    res.render('update_arml_team_score', {query: req.query, testName: testNames});
};

exports.arml_test_update_team_score_post = async (req, res, next) => {
    var score;
    if (!(await ARMLTest.exists({name: req.body.name}))) {
        return req.flash({
            type: 'Warning',
            message: 'There is no ARML test named ' + req.body.name + '.',
            redirect: req.app.get('prefix') + 'test/arml/update/team/add'
        });
    }  else {
        let usernames = req.body.usernames.split(",");
        for(var i=0; i<usernames.length; i++) {
            if (!(await User.exists({username: usernames[i]}))) {
                return req.flash({
                    type: 'Warning',
                    message: 'Cannot find student with username ' + usernames[i] + '.',
                    redirect: req.app.get('prefix') + 'test/arml/update/team/add?name=' + req.body.name
                });
            }
        }
        let test = await ARMLTest.findOne({name: req.body.name});
        if (!valid(req.body.scoreVal, req.body.scoreDist, 10)) {
            return req.flash({
                type: 'Warning',
                message: 'Score value does not match score distribution, or score distribution is not valid.',
                redirect: req.app.get('prefix') + 'test/arml/update/team/add?name=' + req.body.name
            })
        }
        for(var i=0; i<usernames.length; i++) {
            let student = await User.findOne({username: usernames[i]});
            if (await ARMLScore.exists({studentUsername: usernames[i], testName: req.body.name})) {
                let sc = await ARMLScore.findOne({studentUsername: usernames[i], testName: req.body.name});
                sc.teamScore = req.body.scoreVal;
                sc.scoreVal = req.body.scoreVal * 0.2 + sc.relayScore * 0.1 + sc.indScore * 0.7;
                sc.save();
            } else {
                score = new ARMLScore({
                    studentName: student.firstName + ' ' + student.lastName,
                    studentUsername: student.username,
                    studentGradYear: student.gradYear,
                    studentGrade: student.grade,
                    testName: test.name,
                    teamScore: req.body.scoreVal,
                    scoreDist: "00000000",
                    indScore: 0,
                    relayScore: 0,
                    scoreVal: req.body.scoreVal * 0.2
                });
                await score.save();
                test.scores.push(score._id);
                await test.save();
            }
        }
        if(await ARMLTeam.exists({testName: req.body.name, teamName: req.body.teamName})) {
            let tm = await ARMLTeam.findOne({testName: req.body.name, teamName: req.body.teamName});
            tm.usernames=usernames;
            tm.scoreVal=req.body.scoreVal;
            tm.scoreDist=req.body.scoreDist;
            await tm.save();
        } else {
            let tm = new ARMLTeam({
                teamName: req.body.teamName,
                usernames: usernames,
                testName: req.body.name,
                scoreVal: req.body.scoreVal,
                scoreDist: req.body.scoreDist
            });
            await tm.save();
            test.teams.push(tm._id);
            await test.save();
        }
    }
    res.redirect(req.app.get('prefix') + 'test/arml/update/team/add?name=' + req.body.name);
};

exports.arml_test_update_relay_score = async (req, res) => {
    res.locals.metaTags = {
        title: 'Update/Add Relay Score',
    };
    var testNames = [];
    let allTests = await ARMLTest.find({});
    for (var i = 0; i < allTests.length; i++) {
        await testNames.push(allTests[i].name);
    }
    if (req.query.name)
        testNames = [req.query.name];
    res.render('update_arml_relay_score', {query: req.query, testName: testNames});
};

exports.arml_test_update_relay_score_post = async (req, res, next) => {
    var score;
    if (!(await ARMLTest.exists({name: req.body.name}))) {
        return req.flash({
            type: 'Warning',
            message: 'There is no ARML test named ' + req.body.name + '.',
            redirect: req.app.get('prefix') + 'test/arml/update/relay/add'
        });
    }  else {
        let usernames = req.body.usernames.split(",");
        for(var i=0; i<usernames.length; i++) {
            if (!(await User.exists({username: usernames[i]}))) {
                return req.flash({
                    type: 'Warning',
                    message: 'Cannot find student with username ' + usernames[i] + '.',
                    redirect: req.app.get('prefix') + 'test/arml/update/relay/add?name=' + req.body.name
                });
            }
        }
        let test = await ARMLTest.findOne({name: req.body.name});
        let sv=parseInt(req.body.scoreVal);
        if (!valid(sv, req.body.scoreDist, 2)) {
            return req.flash({
                type: 'Warning',
                message: 'Score value does not match score distribution, or score distribution is not valid.',
                redirect: req.app.get('prefix') + 'test/arml/update/relay/add?name=' + req.body.name
            })
        }
        for(var i=0; i<usernames.length; i++) {
            let student = await User.findOne({username: usernames[i]});
            if (await ARMLScore.exists({studentUsername: usernames[i], testName: req.body.name})) {
                let sc = await ARMLScore.findOne({studentUsername: usernames[i], testName: req.body.name});
                sc.relayScore = sv;
                sc.scoreVal = sv * 0.1 + sc.teamScore * 0.2 + sc.indScore * 0.7;
                await sc.save();
            } else {
                score = new ARMLScore({
                    studentName: student.firstName + ' ' + student.lastName,
                    studentUsername: student.username,
                    studentGradYear: student.gradYear,
                    studentGrade: student.grade,
                    testName: test.name,
                    teamScore: 0,
                    scoreDist: "00000000",
                    indScore: 0,
                    relayScore: sv,
                    scoreVal: sv * 0.1
                });
                await score.save();
                test.scores.push(score._id);
                await test.save();
            }
        }
        if(await ARMLRelay.exists({testName: req.body.name, relayName: req.body.relayName})) {
            let re = await ARMLRelay.findOne({testName: req.body.name, relayName: req.body.relayName});
            re.usernames=usernames;
            re.scoreVal=sv;
            re.scoreDist=req.body.scoreDist;
            await re.save();
        } else {
            let re = new ARMLRelay({
                relayName: req.body.relayName,
                usernames: usernames,
                testName: req.body.name,
                scoreVal: sv,
                scoreDist: req.body.scoreDist
            });
            await re.save();
            test.relays.push(re._id);
            await test.save();
        }
    }
    res.redirect(req.app.get('prefix') + 'test/arml/update/relay/add?name=' + req.body.name);
};

exports.arml_test_update_indices = async (req, res) => {
    res.locals.metaTags = {
        title: 'Update Indices',
    };
    var testNames = [];
    let allTests = await ARMLTest.find({});
    for (var i = 0; i < allTests.length; i++) {
        await testNames.push(allTests[i].name);
    }
    res.render('update_arml_indices_test', {testName: testNames});
};

exports.arml_test_update_indices_post = async (req, res, next) => {
    var enoughScores = true;
    if (!(await ARMLTest.exists({name: req.body.testName}))) {
        return req.flash({
            type: 'Warning',
            message: 'There is no test named ' + req.body.testName + '.',
            redirect: req.app.get('prefix') + '/test/arml/update/indices'
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
            query = await ARMLScore.find({testName: test.name}).sort("-scoreVal");
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
                    scoreDist: rank.scoreDist,
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