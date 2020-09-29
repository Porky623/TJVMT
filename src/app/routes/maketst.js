// libraries
const express = require('express');
const router = express.Router();
const marked = require('marked');

// models
const TSTModel = require('../models/tst');
const officerCheck = require('./officer').officerCheck;

router.post('/taketst', async (_req, res) => {
    
});

module.exports = router; 