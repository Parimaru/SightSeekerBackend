const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const uploadAvatar = require("../services/uploadAvatar");
const {
  loginUser,
  signUpUser,
  changeSettings,
  changeAvatar,
  changeDefaultAvatar,
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
app.put("/settings", requireAuth, changeSettings);

app.put("/avatar", requireAuth, uploadAvatar.single("avatar"), changeAvatar);

app.put("/default_avatar", requireAuth, changeDefaultAvatar);
// Add/Change Avatar
app.put("/initalsettings", requireAuth, setInitialSettings);

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
//     "poi": ["beach", "castle"],
//     "foundBy": "all",
//     "locationServices": true,
//     "showEmail": false,
//     "showName": false
// }
// PUT  http://localhost:8080/user/changeSettings
// PUT http://localhost:8080/user/changeAvatar
// GET http://localhost:8080/user/find?search=${someWord}  -> no body, but token required

// PUT http://localhost:8080/user/invite/:invitedUserId -> no body, but token and param
// (e.g http://localhost:8080/user/invite/648df661f48fb9b3213a831a)

// PUT http://localhost:8080/user/answer-invitation
//   -> token + body: {"invitingUserId": "648df661f48fb9b3213a831a", "accepted": true, "received":true}
