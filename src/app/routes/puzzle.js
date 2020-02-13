const express = require('express');
const router = express.Router();
const puzzleController = require('../controllers/puzzle');

router.get('/', puzzleController.load_puzzle);

router.get('/rules', puzzleController.load_rules);

router.get('/map', puzzleController.load_map);

router.get('/abstracton', puzzleController.load_tree);

router.get('/nash', puzzleController.load_genome);

router.get('/abstractmeta', puzzleController.load_abstractmeta);

router.get('/deltopolis', puzzleController.load_rings);

router.get('/capital', puzzleController.load_final);

module.exports = router;