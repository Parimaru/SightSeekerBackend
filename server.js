const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./dbinit");
require("colours");

app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 8080;

connectDB();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(PORT, () => {
  console.log("Running".rainbow);
});
