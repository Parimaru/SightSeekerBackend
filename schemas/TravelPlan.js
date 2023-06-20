const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  name: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
  // votes: {
  //   user: { type: mongoose.Types.ObjectId, ref: "User" },
  //   up: Number,
  //   down: Number,
  // },
  pointTypes: [String],
});

const travelPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        accepted: { type: Boolean, default: false },
      },
    ],
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    dates: {
      startDate: Date,
      endDate: Date,
    },
    // savedRoutes: [{}],
    // votedRoute: {},
    selectedPoints: [pointSchema],
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TravelPlan", travelPlanSchema);
