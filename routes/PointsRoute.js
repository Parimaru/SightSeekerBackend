const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  createPoint,
  deletePoint,
  editPoint,
  getMultiplePoints,
  // getPoint,
  // getAllPoints,
} = require("../controllers/pointsController");

const app = express.Router();

app.post("/", requireAuth, createPoint);
app.put("/", requireAuth, editPoint);
app.delete("/", requireAuth, deletePoint);
app.post("/getMultiplePoints", requireAuth, getMultiplePoints);
// app.get("/:pointId", requireAuth, getPoint);
// app.get("/", requireAuth, getAllPoints);

module.exports = app;
