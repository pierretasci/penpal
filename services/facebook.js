const FB = require('fb');

module.exports = function(app) {
  FB.options({ appSecret: app.locals.config.get('auth.fb.app_secret') });
  app.locals.FB = FB;
}
