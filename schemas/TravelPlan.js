const mongoose = require("mongoose");

const travelPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // creator: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "User",
    // },
    dates: {
      startDate: Date,
      endDate: Date,
    },
    // savedRoutes: [{}],
    // votedRoute: {},
    selectedPoints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Point",
      },
    ],
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TravelPlan", travelPlanSchema);
