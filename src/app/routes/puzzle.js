const express = require('express');
const router = express.Router();
const puzzleController = require('../controllers/puzzle');

router.get('/puzzle', puzzleController.load_puzzle);

router.get('/puzzle_rules', puzzleController.load_rules);

router.get('/puzzle_map', puzzleController.load_map);

router.get('/puzzle_abstracton', puzzleController.load_tree);

router.get('/puzzle_nash', puzzleController.load_genome);

router.get('/puzzle_pascal', puzzleController.load_sesame);

router.get('/puzzle_noether', puzzleController.load_supremelaw);

router.get('/puzzle_abstractmeta', puzzleController.load_abstractmeta);

router.get('/puzzle_deltopolis', puzzleController.load_rings);

router.get('/puzzle_capital', puzzleController.load_final);

module.exports = router;