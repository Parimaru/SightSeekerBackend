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

app.put("/edit/:_id", requireAuth, editTravelplan);

app.get("/:_id", requireAuth, getTravelplan);

app.delete("/", requireAuth, deleteTravelplan);

module.exports = app;
