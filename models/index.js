const mongoose = require('mongoose');
const users = require('./users');

module.exports = function(app) {
  const mongodb_url = app.locals.config.get('mongo');
  mongoose.connect(mongodb_url);
  mongoose.Promise = global.Promise;
  app.locals.models = {};
  users(app);
}
