const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  loginUser: {
    type: String,
    required: true,
    unique: true,
  },
  passwordUser: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
