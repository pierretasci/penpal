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
      if (!user) {
        return Promise.reject('No user');
      }
      // Quickly check to see if our facebook token is still valid. If we are
      // withing 5 days of the access token expiring, then refresh it.
      if (Date.now() >
          new Date(user.accessTokenExpires).getTime() + 432000000) {
        console.log('Expired access token.');
        app.locals.FB.api('oauth/access_token', {
          client_id: app.locals.config.get('auth.fb.app_id'),
          client_secret: app.locals.config.get('auth.fb.app_secret'),
          grant_type: 'fb_exchange_token',
          fb_exchange_token: user.accessToken,
        }, (res) => {
          if (!res || res.error) {
            return reject(res.error);
          }
          user.accessToken = res.access_token;
          user.accessTokenExpires = Date.now() + ( res.expires * 1000 );
          return user.save();
        });
      }
      return Promise.resolve(user);
    }).then((correctedUser) => {
      app.locals.FB.setAccessToken(correctedUser.accessToken);
      done(null, correctedUser);
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
    // Let's immediately exchange this for a long lived token.
    new Promise((resolve, reject) => {
      app.locals.FB.api('oauth/access_token', {
        client_id: app.locals.config.get('auth.fb.app_id'),
        client_secret: app.locals.config.get('auth.fb.app_secret'),
        grant_type: 'fb_exchange_token',
        fb_exchange_token: accessToken
      }, (res) => {
        if (!res || res.error) {
          return reject(res.error);
        }
        return resolve(res);
      });
    }).then((res) => {
      app.locals.FB.setAccessToken(res.access_token);
      const user = {
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        accessToken: res.access_token,
        accessTokenExpires: Date.now() + ( res.expires * 1000 ),
      };

      console.log('USER is: ');
      console.log(user);

      // Add the user's email.
      if (!Array.isArray(profile.emails) || profile.emails.length === 0) {
        return done("Could not create user without email.");
      }
      user.email = profile.emails[0].value;
      User.findOneAndUpdate(user.email, user,
          { upsert: true, new: true }, (err, createdUser) => {
        console.log('Created User: ');
        console.log(createdUser);
        if (err) {
          console.error(err);
          return done(err);
        }
        return done(null, createdUser);
      });
    }).catch((err) => {
      console.error(err);
      done(err);
    });
  }));
}
