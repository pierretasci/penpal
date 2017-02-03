const authentication = require('./authentication');
const facebook = require('./facebook');
const sessions = require('./sessions');

module.exports = function(app) {
  authentication(app);
  facebook(app);
  sessions(app);
}
