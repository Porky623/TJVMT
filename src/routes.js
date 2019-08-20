const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use('/', require('./app/routes/main_routes'));

router.use('/', require('./app/routes/officer').router);

router.use('/', require('./app/routes/contest'));

router.use('/', require('./app/routes/announcement'));

router.use('/test', require('./app/routes/test'));

module.exports = router;