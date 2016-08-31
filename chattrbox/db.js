var MONGODB_URL = process.env.MONGODB_URL;

var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URL);

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  email: String,
  name:  String
});
UserSchema.plugin(findOrCreate);

var User = mongoose.model('User', UserSchema);

module.exports = { User };
