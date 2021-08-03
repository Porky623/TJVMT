const express = require('express');
const router = express.Router();
const Contest = require('../models/contest');
const officerCtl = require('../controllers/officer');

const officerCheck = function officerCheck(req, res, next) {
  if(!req.user) {
    return res.redirect(req.app.get('prefix')+'auth/login');
  }
  if (!req.user.isOfficer) {
    return res.redirect(req.app.get('prefix')+'');
  }
  next();
};

const sendCtlResult = (msg, res) => {
    if (msg.status === "success") res.status(200).send(msg);
    else res.status(500).send(msg);
}

// officers page
router.get('/', officerCheck, async (req, res) => {
    res.locals.metaTags = {
        title: 'Officers',
    };

    res.render('officer');
});

// tst routes
router.get('/tst', officerCheck, async (req, res) => {
    officerCtl.getTsts()
        .then(msg => sendCtlResult(msg, res))
        .catch(err => console.log(err));
});

router.post('/tst', officerCheck, async (req, res) => {
    officerCtl.createTst(req.body.newTst)
        .then(msg => sendCtlResult(msg, res))
        .catch(err => console.log(err));
});

router.put('/tst/', officerCheck, async (req, res) => {
    officerCtl.editTst(req.body.editedTst)
        .then(msg => sendCtlResult(msg, res))
        .catch(err => console.log(err));
});

router.delete('/tst/', officerCheck, async (req, res) => {
    officerCtl.deleteTst(req.query.tstId)
        .then(msg => sendCtlResult(msg, res))
        .catch(err => console.log(err));
});

// contest routes
router.get('/contest', officerCheck, async (req, res) => {
    officerCtl.getContests()
        .then(msg => sendCtlResult(msg, res))
        .catch(err => console.log(err));
});

router.post('/contest', officerCheck, async (req, res) => {
    officerCtl.createContest(req.body.newContest)
        .then(msg => sendCtlResult(msg, res))
        .catch(err => console.log(err));
});

router.put('/contest', officerCheck, async (req, res) => {
    officerCtl.editContest(req.body.editedContest)
        .then(msg => sendCtlResult(msg, res))
        .catch(err => console.log(err));
});

router.delete('/contest', officerCheck, async (req, res) => {
    officerCtl.deleteContest(req.query.contestId)
        .then(msg => sendCtlResult(msg, res))
        .catch(err => console.log(err));
});

module.exports.router = router;
module.exports.officerCheck = officerCheck;