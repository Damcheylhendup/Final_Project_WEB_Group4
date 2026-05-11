const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    email: String,
    photo: String,
    provider: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);