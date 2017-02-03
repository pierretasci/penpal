const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const SECONDS_P_HOUR = 3600;

module.exports = function(app) {
  config = app.locals.config;
  app.use(session({
    cookie: {
      maxAge: SECONDS_P_HOUR * 24 * 365, // 1 year.
    },
    store: new RedisStore({
      host: config.get('host'),
      port: 6379,
      ttl: SECONDS_P_HOUR * 24 * 365, // 1 year.
    }),
    secret: config.get('secret'),
    resave: false,
    rolling: true,
    saveUninitialized: false,
  }));
}
