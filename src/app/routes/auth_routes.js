const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    console.log('/login')
    res.locals.metaTags = {
        title: 'Login',
    };
    res.render('login');
});

router.get('/ion', passport.authenticate('ion', {
    scope: "read",
}));

router.get('/ion/redirect', passport.authenticate('ion', {
     failureRedirect: 'https://activities.tjhsst.edu/vmt/auth/login' 
    //  failureRedirect: "http://localhost:3000/auth/ion/redirect"
    }), (req, res) => {
    console.log('/here')
    res.redirect(req.app.get('prefix'));
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(req.app.get('prefix'));
});

module.exports = router;