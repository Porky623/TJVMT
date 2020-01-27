const express = require('express');
const router = express.Router();
const puzzleController = require('../controllers/puzzle');
const officerCheck = require('../routes/officer').officerCheck;

router.get('/add', officerCheck, puzzleController.load_puzzle);

// router.get('/puzzle', (req, res) => {
//     res.locals.metaTags = {
//         title: 'Puzzle Hunt',
//     };
//     res.render('puzzle');
// });

module.exports = router;