const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const uploadAvatar = require("../services/uploadAvatar");
const {
  loginUser,
  signUpUser,
  addAvatarUser,
  findUsersByContact,
} = require("../controllers/user");

const app = express.Router();
//Login
app.post("/login", loginUser);

//Signup
app.post("/signup", signUpUser);

// Add/Change Avatar
app.put("/avatar", requireAuth, uploadAvatar.single("avatar"), addAvatarUser);

// Get all users by contact query  --> /user/find?search=
app.get("/find", requireAuth, findUsersByContact);

module.exports = app;
