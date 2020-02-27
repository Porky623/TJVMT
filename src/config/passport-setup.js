const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const keys = require('./keys');
const User = require('../app/models/user');

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((id, done) => {
  User.findOne({username: id}).then((user) => {
    done(null, user);
  });
});

OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get('https://ion.tjhsst.edu/api/profile', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      var json = JSON.parse(body);

      done(null, json);
    } catch(e) {
      done(e);
    }
  });
};

passport.use('ion', client=new OAuth2Strategy({
      authorizationURL: 'https://ion.tjhsst.edu/oauth/authorize',
      tokenURL: 'https://ion.tjhsst.edu/oauth/token/',
      clientID: keys.ion.clientID,
      clientSecret: keys.ion.clientSecret,
      //For the actual site
       callbackURL: 'https://activities.tjhsst.edu/vmt/auth/ion/redirect',
      //For local usage
      // callbackURL: 'http://localhost:3000/auth/ion/redirect',
    },async (accessToken, refreshToken, profile, cb) => {
      // check if user already exists in our own db
      let currentUser = await User.findOne({username: profile.ion_username});
      if(currentUser){
        // already have this user
        console.log('Getting existing user');
        cb(null, currentUser);
      } else {
        // if not, create user in our db
        let newUser = new User({
          firstName: profile.first_name,
          lastName: profile.last_name,
          gradYear: profile.graduation_year,
          email: profile.tj_email,
          username: profile.ion_username,
          isOfficer: false,
        });
        newUser.save();
        console.log('Creating new user');
        cb(null, newUser);
      }
    })
);