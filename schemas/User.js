const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const location = new mongoose.Schema({
  name: { type: String },
  coordinates: {
    lat: Number,
    lng: Number,
  },
});

const favorites = new mongoose.Schema({
  name: { type: String },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  pointTypes: { type: [String] },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  avatar: { type: String },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  favorites: { type: [favorites] },
  currentLocation: { type: location },
  friends: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      accepted: { type: Boolean, default: false },
      received: { type: Boolean, default: false },
    },
  ], // User.findById(_id).populate('user', "avatar username")
  settings: { type: [String] },
  chats: [{ type: mongoose.Types.ObjectId, ref: "Chat" }],
  travelPlans: [{ type: mongoose.Types.ObjectId, ref: "TravelPlan" }],
});

userSchema.statics.signup = async function (email, password, userName, name) {
  const existsEmail = await this.findOne({ email });
  const existsUserName = await this.findOne({ userName });

  if (existsEmail) {
    throw Error("Email already in use");
  }
  if (existsUserName) {
    throw Error("User-name already in use");
  }

  if (!email || !password || !name || !userName) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Make sure to use at least 8 characters, one upper case letter, a number and a symbol"
    );
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, userName, name });

  return user;
};

// static custom login method
userSchema.statics.login = async function (loginOne, password) {
  if (!loginOne || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({
    $or: [{ email: loginOne }, { userName: loginOne }],
  }).populate("friends.user", "userName avatar _id"); // in field friends: get only _id, userName and avatar

  if (!user) {
    throw Error("Incorrect email or user name");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
