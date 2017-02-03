const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;

module.exports = function(app) {
  const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    processed: { type: Boolean, default: false },
    accessToken: String,
    accessTokenExpires: Date,
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  });
  UserSchema.plugin(findOrCreate);
  const UserModel = mongoose.model('User', UserSchema);
  app.locals.models.User = UserModel;
}
