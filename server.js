require("dotenv").config();
require("colours");
const express = require("express");
const cors = require("cors");
const connectDB = require("./dbinit");
const userRoutes = require("./routes/user");
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome");
});
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log("Running".rainbow);
});
