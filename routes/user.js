const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const uploadAvatar = require("../services/uploadAvatar");
const {
  loginUser,
  signUpUser,
  setInitialSettings,
  findUsersByContact,
  inviteUserAsFriend,
  handleInvitation,
} = require("../controllers/user");

const app = express.Router();
//Login
app.post("/login", loginUser);

//Signup
app.post("/signup", signUpUser);

// Update
// app.put("/:id", changeSettings);

// Add/Change Avatar
app.put(
  "/initalsettings",
  requireAuth,
  uploadAvatar.single("avatar"),
  setInitialSettings
);

// Get all users by contact query  --> /user/find?search=
app.get("/find", requireAuth, findUsersByContact);

// Invite user as friend - you can use _id, email or userName
app.put("/invite/:invitedUserId", requireAuth, inviteUserAsFriend);

// Handle invitation / accept or reject / delete friend
app.put("/answer-invitation", requireAuth, handleInvitation);

module.exports = app;

// POST http://localhost:8080/user/signup  -> JSON with at least userName, name, email and password
// POST http://localhost:8080/user/login   -> JSON with userName/email and password

// PUT  http://localhost:8080/user/initialSettings -> form-data with one (jpg, jpeg, png, webp) on field "avatar" attached, token required + body: {
//     "_id": "648984b47bf00ee0b75b5264",
//     "preferences": ["beach", "castle"],
//     "foundBy": "all",
//     "locationServices": true,
//     "showEmail": false,
//     "showName": false
// }

// GET http://localhost:8080/user/find?search=${someWord}  -> no body, but token required

// PUT http://localhost:8080/user/invite/:invitedUserId -> no body, but token and param
// (e.g http://localhost:8080/user/invite/648df661f48fb9b3213a831a)

// PUT http://localhost:8080/user/answer-invitation
//   -> token + body: {"invitingUserId": "648df661f48fb9b3213a831a", "accepted": true, "received":true}
