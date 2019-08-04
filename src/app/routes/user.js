var express = require('express');
const path = require('path')
var router = express();

// Require controller modules.
var user_controller = require('../controllers/userController');
const userAuthController = require('../controllers/userAuthController');

/// USER ROUTES ///
router.set('views', path.join(path.resolve(__dirname), '../../views'));

// GET request for creating User. NOTE This must come before route for id (i.e. display user).
router.get('/user/create', user_controller.user_create_get);

// POST request for creating User.
router.post('/user/create', user_controller.user_create_post);

router.get('/user/delete/:id', user_controller.user_delete_get)

router.post('/user/delete/:id', user_controller.user_delete_post);

// GET request to update User.
router.get('/user/:id/update', user_controller.user_update_get);

// POST request to update User.
router.post('/user/:id/update', user_controller.user_update_post);

// GET request for one User.
router.get('/user/:id', user_controller.user_detail);

// GET request for list of all Users.
router.get('/users', user_controller.user_list);

module.exports = router;