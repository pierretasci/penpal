const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('config');

module.exports = function(app) {
  const User = app.locals.models.User;
  const fb = app.locals.config.get('auth').fb;

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findOne({_id: id}).then((user) => {
      done(null, user);
    }).catch((err) => {
      done(err);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: fb.app_id,
    clientSecret: fb.app_secret,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['email', 'name'],
  }, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    const u = {
      name: `${profile.name.givenName} ${profile.name.familyName}`,
    };

    // Add the user's email.
    if (!Array.isArray(profile.emails) || profile.emails.length === 0) {
      console.error('Could not create user without email.');
      return done("Could not create user without email.");
    }
    u.email = profile.emails[0].value;
    console.log(u);
    User.findOrCreate(u, (err, user) => {
      if (err) {
        console.error(err);
        return done(err);
      }
      return done(null, user);
    })
  }));
}
