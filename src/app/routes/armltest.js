const express = require('express');
const router = express.Router();
const armltestController = require('../controllers/armltest');
const officerCheck = require('../routes/officer').officerCheck;

//Add ARML tests
router.get('/add', officerCheck, armltestController.test_create);

router.post('/add', officerCheck, armltestController.test_create_post);

router.get('/update/score/add', officerCheck, armltestController.test_update_score);

router.post('/update/score/add', officerCheck, armltestController.test_update_score_post);

router.get('/update/team/add', officerCheck, armltestController.test_update_team);

router.post('/update/team/add', officerCheck, armltestController.test_update_team_post);

router.get('/update/relay/add', officerCheck, armltestController.test_update_relay);

router.post('/update/relay/add', officerCheck, armltestController.test_update_relay_post);

router.get('/update/indices', officerCheck, armltestController.test_update_indices);

router.post('/update/indices', officerCheck, armltestController.test_update_indices_post);

module.exports = router;