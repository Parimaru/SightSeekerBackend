const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { loginUser, signUpUser } = require("../controllers/user");

const app = express.Router();
//Login
app.post("/login", loginUser);

//Signup
app.post("/signup", signUpUser);

// Update
// app.put("/:id", changeSettings);

module.exports = app;
