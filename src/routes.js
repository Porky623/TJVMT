const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use('/', require('./app/routes/main_routes'));

router.use('/auth', require('./app/routes/auth_routes'));

router.use('/officer', require('./app/routes/officer_routes').router);

router.use('/', require('./app/routes/news'));

module.exports = router;