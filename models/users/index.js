const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;

module.exports = function(app) {
  const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    createdAt: Date,
    updateAt: Date,
  });
  UserSchema.plugin(findOrCreate);
  const UserModel = mongoose.model('User', UserSchema);
  app.locals.models.User = UserModel;
}
