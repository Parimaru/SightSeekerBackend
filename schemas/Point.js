const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  name: String,
  coordinates: [Number],
  address: String,
  // votes: {
  //   user: { type: mongoose.Types.ObjectId, ref: "User" },
  //   up: Number,
  //   down: Number,
  // },
  pointTypes: [String],
});

module.exports = mongoose.model("Point", pointSchema);
