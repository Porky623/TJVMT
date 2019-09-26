const Contest = require('../models/contest');
const TestWeight = require('../models/testWeighting');
const Test = require('../models/test');
const Ind = require('../models/ind');
const User = require('../models/user');
const flash = require('express-flash-notification');
const RankPage = require('../models/rankpage');

exports.contest_create = async (req, res) => {
    res.locals.metaTags = {
        title: 'Add Contest',
    };
    res.render('add_contest');
};

exports.contest_create_post = async (req, res, next) => {
    if (!(await Contest.exists({name: req.body.name}))) {
        var contest = new Contest({
            name: req.body.name
        });
        await contest.save();
        console.log('Contest created!');
    } else {
        return req.flash({
            type: 'Warning',
            message: 'There already exists a contest name ' + req.body.name + '! Contest not created.',
            redirect: req.app.get('prefix') + 'officers'
        });
    }
    res.redirect(req.app.get('prefix') + 'officers');
};

//Select which contest to update
exports.contest_update_tests_name = async (req, res) => {
    res.locals.metaTags = {
        title: 'Select Contest',
    };
    var contestNames = [];
    let allContests = await Contest.find({});
    for (var i = 0; i < allContests.length; i++) {
        await contestNames.push(allContests[i].name);
    }
    res.render('update_contest_test_name', {contestName: contestNames});
};

exports.contest_update_tests_add = async (req, res) => {
    res.locals.metaTags = {
        title: 'Input Weight',
    };
    if (!(await Contest.exists({name: req._parsedOriginalUrl.query.substring(5)}))) {
        return req.flash({
            type: 'Warning',
            message: 'There is no contest name ' + req._parsedOriginalUrl.query.substring(5),
            redirect: req.app.get('prefix') + 'contest/update/test'
        });
    }
    var testNames = [];
    let allTests = await Test.find({});
    for (var i = 0; i < allTests.length; i++) {
        await testNames.push(allTests[i].name);
    }
    res.render('update_contest_test_add',
        {query: req._parsedOriginalUrl.query, testName: testNames});
};

exports.contest_update_tests_add_post = async (req, res, next) => {
    var weight;
    var test = await Test.findOne({name: req.body.testName});
    weight = new TestWeight({
        contestName: req.query.name,
        testId: test._id,
        weighting: req.body.testWeight
    });
    weight.save();
    weight.populate('testId');
    let contest = await Contest.findOne({name: req.query.name});
    test = Test.findOne({name: req.body.testName});
    contest.tests.push(test._id);
    contest.populate('tests');
    contest.weighting.push(weight._id);
    await contest.save();
    res.redirect(req.app.get('prefix') + 'contest/update/test/add?name=' + req.query.name);
};

exports.contest_update_indices = async (req, res) => {
    res.locals.metaTags = {
        title: 'Update Indices',
    };
    var contestNames = [];
    let allContests = await Contest.find({});
    for (var i = 0; i < allContests.length; i++) {
        await contestNames.push(allContests[i].name);
    }
    res.render('update_indices_contest', {contestName: contestNames});
};

exports.contest_update_indices_post = async (req, res, next) => {
    if (!(await Contest.exists({name: req.body.contestName}))) {
        return req.flash({
            type: 'Warning',
            message: 'There is no contest named ' + req.body.contestName + '.',
            redirect: req.app.get('prefix') + 'officers'
        });
    }
    let contest = await Contest.findOne({name: req.body.contestName});
    await RankPage.deleteMany({testName: contest.name});
    await Ind.deleteMany({testName: contest.name});
    let conIndices = new Map();
    let pumacInds = new Map();
    if (contest.name == "2019pumac") {
        for (var i = 0; i < contest.weighting.length; i++) {
            let weighting = await TestWeight.findById(contest.weighting[i]);
            let test = await Test.findById(weighting.testId);
            if (test.name.substring(0, 9) == "2019pumac") {
                for (var j = 0; j < test.indices.length; j++) {
                    let index = await Ind.findById(test.indices[j]);
                    if (!pumacInds.has(index.studentUsername)) {
                        pumacInds.set(index.studentUsername, []);
                    }
                    pumacInds.get(index.studentUsername).push(index.indexVal);
                }
            } else {
                for (var j = 0; j < test.indices.length; j++) {
                    let index = await Ind.findById(test.indices[j]);
                    let weightedInd = index.indexVal * weighting.weighting;
                    if (!conIndices.has(index.studentUsername)) {
                        conIndices.set(index.studentUsername, 0);
                    }
                    conIndices.set(index.studentUsername,
                        conIndices.get(index.studentUsername) + weightedInd);
                }
            }
        }
        for (var username, pumInds of pumacInds) {
            for (var i = pumInds.length; i < 4; i++) {
                pumInds.push(0);
            }
            pumInds.sort();
            if (!conIndices.has(username)) {
                conIndices.set(username, 0);
            }
            conIndices.set(username,
                conIndices.get(username) + .3 * pumInds[3] + .3 * pumInds[2] + .1 * pumInds[1]);
        }
    } else
        for (var i = 0; i < contest.weighting.length; i++) {
            let weighting = await TestWeight.findById(contest.weighting[i]);
            let test = await Test.findById(weighting.testId);
            for (var j = 0; j < test.indices.length; j++) {
                let index = await Ind.findById(test.indices[j]);
                let weightedInd = index.indexVal * weighting.weighting;
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
    let indices = await Ind.find({testName: req.body.contestName}).sort("-indexVal");
    let rankPage = new RankPage({testName: contest.name});
    for (var i = 0; i < indices.length; i++) {
        let rank = indices[i];
        var rankVal;
        if (i == 0) {
            last = rank.indexVal;
        }
        if (rank.indexVal == last) {
            rankVal = lastRank;
        } else {
            last = rank.indexVal;
            lastRank = i + 1;
            rankVal = lastRank;
        }
        var rowClass;
        if (i % 2 == 0) {
            rowClass = 'table-light';
        } else {
            rowClass = 'table-active';
        }
        await rankPage.out.push({
            rank: rankVal,
            studentName: rank.studentName,
            indexVal: rank.indexVal,
            gradYear: rank.studentGradYear,
            rowClass: rowClass,
        });
    }
    Ind.deleteMany({testName: contest.name});
    rankPage.save();
    res.redirect(req.app.get('prefix') + 'officers');
};