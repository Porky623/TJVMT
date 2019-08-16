const express = require('express');
const router = express.Router();

router.use('/', require('./app/routes/main_routes'));

router.use('/', require('./app/routes/officer').router);

router.use('/', require('./app/routes/contest'));

module.exports = router;