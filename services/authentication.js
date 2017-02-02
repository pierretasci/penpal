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
    callbackURL: '/auth/facebook/callback'
  }, (accessToken, refreshToken, profile, done) => {
    User.findOrCreate({
      name: profile.displayName,
    }, (err, user) => {
      if (err) {
        console.error(err);
        return done(err);
      }
      return done(null, user);
    })
  }));
}
