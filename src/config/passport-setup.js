const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const mongoose = require('mongoose');
const keys = require("./keys");
const User = require('../app/models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(mongoose.Types.ObjectId(id), (err, user) => {
        done(err, user);
    });
});

OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
    this._oauth2.get('https://ion.tjhsst.edu/api/profile', accessToken, (err, body, res) => {
        if (err) {
            return done(new InternalOAuthError('failed to fetch user profile', err));
        }
        try {
            let json = JSON.parse(body);
            done(null, json);
        }
        catch (e) {
            done(e);
        }
    });
};

passport.use('ion', new OAuth2Strategy({
    authorizationURL: 'https://ion.tjhsst.edu/oauth/authorize/',
    tokenURL: 'https://ion.tjhsst.edu/oauth/token/',
    clientID: keys.ion.clientID,
    clientSecret: keys.ion.clientSecret,
    callbackURL: "https://activities.tjhsst.edu/vmt/auth/ion/redirect"
    // callbackURL: "http://localhost:3000/auth/ion/redirect"
}, async (accessToken, refreshToken, profile, done) => {
    let curUser = await User.findOne({ionUsername: profile.ion_username});
    if (curUser) {
        done(null, curUser);
    }
    else {
        let newUser = new User({
            firstName: profile.first_name,
            lastName: profile.last_name,
            ionUsername: profile.ion_username,
            gradYear: profile.graduation_year,
            email: profile.tj_email,
            onEmailList: false,
            isOffier: false,
        });
        await newUser.save();
        done(null, newUser);
    }
}));
