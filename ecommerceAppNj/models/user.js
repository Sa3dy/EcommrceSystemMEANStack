const mongoose = require("mongoose");
const crypto = require("crypto");
require("assert");

var Schema = require("mongoose").Schema;
var ObjectId = require("mongoose").Types.ObjectId;

var userSchema = new Schema({
  ObjectId: ObjectId,
  name: { type: String, unique: false, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, unique: false, required: true },
  createdAt: { type: Date, default: Date.now },
  // admin for Admin, customer for Customer.
  role: { type: String, unique: false, required: true }
});

var algorithm = 'aes256'; 
var key = 'D#$DF#QD#@~!W@E@';
var pw = '';

userSchema.methods.encrypt = function encrypt(str) {
  pw = str;
  var cipher = crypto.createCipher(algorithm, key);
  var encrypted = cipher.update(pw, "utf8", "hex") + cipher.final("hex");
  console.log("ENCRYPTED: " + encrypted);
  return encrypted;
};

userSchema.path("password").set(function(v) {
  return this.encrypt(v);
});

var User = mongoose.model("User", userSchema);

module.exports = { User };
