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

router.get('/puzzle_turing', puzzleController.load_madness);

router.get('/puzzle_fermat', puzzleController.load_picture);

router.get('/puzzle_cayley', puzzleController.load_schoolhouse);

router.get('/puzzle_galois', puzzleController.load_redwhiteblue);

router.get('/puzzle_abstractmeta', puzzleController.load_abstractmeta);

router.get('/puzzle_deltopolis', puzzleController.load_rings);

router.get('/puzzle_deltameta', puzzleController.load_deltameta);

router.get('/puzzle_frobenius', puzzleController.load_vacation);

router.get('/puzzle_laplace', puzzleController.load_wordsearch);

router.get('/puzzle_lagrange', puzzleController.load_gallery);

router.get('/puzzle_fourier', puzzleController.load_conclusions);

router.get('/puzzle_cauchy', puzzleController.load_primary);

router.get('/puzzle_legendre', puzzleController.load_initiative);

router.get('/puzzle_fibonacci', puzzleController.load_flow);

router.get('/puzzle_capital', puzzleController.load_final);

module.exports = router;