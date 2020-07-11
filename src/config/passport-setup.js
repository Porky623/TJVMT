const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const User2 = require('../app/models/userv2');
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User2.findById(mongoose.Types.ObjectId(id), (err, user) => {
        done(err, user);
    });
});

passport.use('ion', new LocalStrategy({ usernameField: "ionUsername"}, async (ionUsername, password, done) => {
        await User2.findOne({ionUsername: ionUsername}, function(err, user) {
            if (err) { return done(err) }
            if (!user) {
                return done(null, false, { message: 'Username not found.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {message: 'Incorrect password.'});
            }
            return done(null, user);
        });
    })
);