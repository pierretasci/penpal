const session = require('express-session');
const RedisStore = require('connect-redis')(session);

module.exports = function(app) {
  config = app.locals.config;
  app.use(session({
    store: new RedisStore({
      host: config.get('host'),
      port: 6379,
    }),
    secret: config.get('secret'),
    resave: true,
    saveUninitialized: false,
  }));
}
