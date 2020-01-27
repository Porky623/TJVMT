const express = require('express');
const router = express.Router();
const puzzleController = require('../controllers/puzzle');
const officerCheck = require('../routes/officer').officerCheck;

module.exports = router;