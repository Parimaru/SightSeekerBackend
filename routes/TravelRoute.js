const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  createTravelplan,
  editTravelplan,
  deleteTravelplan,
  getTravelplan,
  saveTravelplanPoints,
} = require("../controllers/travelrouteController");

const app = express.Router();

app.post("/new", requireAuth, createTravelplan);

app.put("/edit/:_id", requireAuth, editTravelplan);
app.put("/savePoints/:_id", requireAuth, saveTravelplanPoints);

app.get("/:_id", requireAuth, getTravelplan);

app.delete("/", requireAuth, deleteTravelplan);

module.exports = app;
