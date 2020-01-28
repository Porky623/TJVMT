const express = require('express');
const router = express.Router();
const puzzleController = require('../controllers/puzzle');

router.get('/', puzzleController.load_puzzle);

router.get('/rules', puzzleController.load_rules);

router.get('/map', puzzleController.load_map);

module.exports = router;