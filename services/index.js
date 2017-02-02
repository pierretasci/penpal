const authentication = require('./authentication');
const sessions = require('./sessions');

module.exports = function(app) {
  authentication(app);
  sessions(app);
}
