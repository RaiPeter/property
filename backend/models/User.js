const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: String,
    refreshToken: {
      type: String,
      default: undefined,
    },
    role: {
      type : String,
      default: "admin"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("Contact", userSchema);

module.exports = {
  User,
};
