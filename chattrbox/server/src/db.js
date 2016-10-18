var MONGODB_URI = process.env.MONGODB_URI;

var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: String,
  name:  String
});
UserSchema.plugin(findOrCreate);

var User = mongoose.model('User', UserSchema);

var MessageSchema = new Schema({
  user: String,
  message: String,
  timestamp: Number
});

var Message = mongoose.model('Message', MessageSchema);

module.exports = {
  User,
  Message
};
