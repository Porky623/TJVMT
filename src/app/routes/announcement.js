const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcement');
const officerCheck = require('../routes/officer').officerCheck;

router.get('/announcement/add', officerCheck, announcementController.announcement_create);

router.post('/announcement/add', officerCheck, announcementController.announcement_create_post);

router.get('/announcement/delete', officerCheck, announcementController.announcement_delete);

router.post('/announcement/delete', officerCheck, announcementController.announcement_delete_post);

module.exports = router;