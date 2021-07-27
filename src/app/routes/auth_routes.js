const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/ion', passport.authenticate('ion', {
    scope: "read",
}));

router.get('/ion/redirect', passport.authenticate('ion', { failureRedirect: '/auth/login' }), (req, res) => {
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;