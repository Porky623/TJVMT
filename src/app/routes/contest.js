const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contest');
const officerCheck = require('../routes/officer').officerCheck;

//Add Contests
router.get('/contest/add', officerCheck, contestController.contest_create);

router.post('/contest/add', officerCheck, contestController.contest_create_post);

router.get('/contest/update/test', officerCheck, contestController.contest_update_tests_name);

router.get('/contest/update/test/add', officerCheck, contestController.contest_update_tests_add);

router.post('/contest/update/test/add', officerCheck, contestController.contest_update_tests_add_post);

module.exports = router;