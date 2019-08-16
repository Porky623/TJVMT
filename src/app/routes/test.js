const express = require('express');
const router = express.Router();
const testController = require('../controllers/test');
const officerCheck = require('../routes/officer').officerCheck;

//Add Contests
router.get('/add', officerCheck, testController.test_create);

router.post('/add', officerCheck, testController.test_create_post);

router.get('/update/score', officerCheck, testController.test_update_score_name);

router.post('/update/score', officerCheck, testController.test_update_score_name_post);

router.get('/update/score/add', officerCheck, testController.test_update_score);

router.post('/update/score/add', officerCheck, testController.test_update_score_post);

router.get('/update/indices', officerCheck, testController.test_update_indices);

router.post('/update/indices', officerCheck, testController.test_update_indices_post);

module.exports = router;