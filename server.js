require("dotenv").config();
require("colours");
const express = require("express");
const cors = require("cors");
const connectDB = require("./dbinit");
const userRoutes = require("./routes/user");
const PORT = process.env.PORT || 8080;

const app = express();

const whitelist = ["http://localhost:3000", "https://sightseeker.netlify.app"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Haha"));
    }
  },
};

app.use(function setCommonHeaders(req, res, next) {
  res.set("Access-Control-Allow-Private-Network", "true");
  next();
});

app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", cors(corsOptions), (req, res) => {
  res.send("Welcome");
});
app.use("/user", cors(), userRoutes);

app.listen(PORT, () => {
  console.log("Running".rainbow);
});
