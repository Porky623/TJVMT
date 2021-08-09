const express = require('express');
const router = express.Router();
const { getTsts, getContests, getScores } = require('../controllers/officer');

router.get('/', async (req, res) => {
    const tstLabels = (await (getTsts())).tsts.map(tst => tst.name);
    const contestLabels = (await (getContests())).contests.map(contest => `${contest.name} - ${contest.year}`);
    res.locals.metaTags = {
        title: 'Rankings',
    };
    res.render('rankings', { tstLabels, contestLabels });
});

router.get('/tst', async (req, res) => {
    let scores = (await (getScores(req.query.tst))).scores.map(score => { 
        return ({
            userIonUsername: score.userIonUsername,
            tst: score.tst,
            index: score.index,
            correct: score.correct.join('')
        });
    });
    res.locals.metaTags = {
        title: 'Rankings',
    }
    scores.sort((a, b) => b.index - a.index);
    scores = scores.map((score, i) => { return {...score, rank: i + 1}; });
    res.render('rankings_view', { tst: req.query.tst, scores });
});

router.get('/contest', (req, res) => {

});

module.exports.router = router;