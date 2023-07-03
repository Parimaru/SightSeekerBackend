const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  createTravelplan,
  editTravelplan,
  deleteTravelplan,
  getTravelplan,
} = require("../controllers/travelrouteController");

const app = express.Router();

app.post("/new", requireAuth, createTravelplan);

app.put("/:travelplanID", requireAuth, editTravelplan);

app.get("/:travelplanID", requireAuth, getTravelplan);

app.delete("/delete/:travelplanID", requireAuth, deleteTravelplan);

module.exports = app;
