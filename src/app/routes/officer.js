const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Contest = require('../models/contest');
const { restart } = require('nodemon');

const officerCheck = function officerCheck(req, res, next) {
  if(!req.user) {
    return res.redirect(req.app.get('prefix')+'auth/login');
  }
  if (!req.user.isOfficer) {
    return res.redirect(req.app.get('prefix')+'');
  }
  next();
};

// officers
router.get('/officer', officerCheck, async function getOfficerPage(req, res) {
    res.locals.metaTags = {
    title: 'Officers',
    };

    let allContests = await Contest.find({}); 
    console.log(allContests);
    allContests = allContests.map(function(obj) {return obj.toObject()});

    res.render('officer', {contests: allContests});
});

// create contest
router.post("/officer/contest", officerCheck, async function handleCreateContest(req, res, next) {
    if (await Contest.exists({name: req.body.contest_name})) {
        return req.flash({
            type: "Warning",
            message: "A contest with the provided name already exists.",
            redirect: req.app.get("prefix") + "officer"
        });
    }
    else {
        const contest = await new Contest();
        contest.name = req.body.new_contest_name;
        await contest.save();
        return res.redirect(req.app.get('prefix') + "officer");
    }
});

// //Add Officer
// router.get('/add_officer', officerCheck, (req, res) => {
//   res.locals.metaTags = {
//     title: 'Add Officers',
//   };
//   res.render('add_officer', { user: req.user });
// });

// router.post('/add_officer', officerCheck, async (req, res)=> {
//   if (!(await User.exists({username: req.body.username}))) {
//     return req.flash({
//       type: 'Warning',
//       message: 'Cannot find student with username '+req.body.username,
//       redirect: req.app.get('prefix')+'add_officer'
//     });
//   }
//   await User.updateOne({username: req.body.username},
//       {isOfficer: true});
//   res.render('add_officer', {user: req.user});
// });

// //Remove Officers
// router.get('/remove_officer', officerCheck, (req, res) => {
//   res.locals.metaTags = {
//     title: 'Remove Officers',
//   };
//   res.render('remove_officer', { user: req.user });
// });

// router.post('/remove_officer', officerCheck, async (req, res) => {
//   if (!(await User.exists({username: req.body.username}))) {
//     return req.flash({
//       type: 'Warning',
//       message: 'Cannot find student with username '+req.body.username,
//       redirect: req.app.get('prefix')+'add_officer'
//     })
//   }
//   await User.updateOne({username: req.body.username},
//       {isOfficer: false});
//   res.render('remove_officer', {user: req.user});
// });

module.exports.router = router;
module.exports.officerCheck = officerCheck;