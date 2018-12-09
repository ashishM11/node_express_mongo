const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fname: { required: true, type: String },
  lname: { required: true, type: String },
  email: { required: true, type: String },
  mobile: { required: true, type: String },
  password: { required: true, type: String }
});

module.exports = mongoose.model("users", userSchema);
