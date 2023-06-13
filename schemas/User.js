const mongoose = require("mongoose");

const location = new mongoose.Schema({
  name: { type: String },
  coordinates: { type: [mongoose.Decimal128] },
});

const favorites = new mongoose.Schema({
  name: { type: String },
  coordinates: { type: [mongoose.Decimal128] },
  pointTypes: { type: [String] },
});

const user = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  avatar: { type: String },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  favorites: { type: [favorites] },
  currentLocation: { type: location },
  friends: { type: [mongoose.ObjectId] },
  settings: { type: [String] },
  chat: { type: [mongoose.ObjectId] },
  travelplan: { type: [mongoose.ObjectId] },
});

module.exports = mongoose.model("user", user);
