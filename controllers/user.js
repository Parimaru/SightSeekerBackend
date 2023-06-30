const mongoose = require("mongoose");
const User = require("../schemas/User");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

// login user
const loginUser = async (req, res) => {
  const { loginOne, password } = req.body;

  try {
    const user = await User.login(loginOne, password);
    //create tokens
    const token = createToken(user._id);
    // select only needed data
    // let { password, ...userSafe } = user;
    // console.log(userSafe)
    const userWithoutPW = {
      _id: user._id,
      userName: user.userName,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      favorites: user.favorites,
      friends: user.friends,
      currentLocation: user.currentLocation,
      settings: user.settings,
      chats: user.chats,
      travelPlans: user.travelPlans,
    };
    res.status(200).json({
      data: userWithoutPW,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// retrieve user if valid stored token
const retrieveUser = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findOne({ _id })
      .select("-password")
      .populate("friends.user", "userName avatar _id name");

    if (!user) return res.status(401).json({ error });
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// sign up user
const signUpUser = async (req, res) => {
  const { email, password, userName, name } = req.body;
  try {
    // console.log("in the trycatch: ", email, password, userName, name);

    const user = await User.signup(email, password, userName, name);
    console.log(user);
    //create token
    const token = createToken(user._id);

    // delete user.password;
    const userWithoutPW = {
      _id: user._id,
      userName: user.userName,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      favorites: user.favorites,
      friends: user.friends,
      currentLocation: user.currentLocation,
      settings: user.settings,
      chats: user.chats,
      travelPlans: user.travelPlans,
    };
    res.status(200).json({
      data: userWithoutPW,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changeAvatar = async (req, res) => {
  const { _id } = req.user;
  const avatar = req.file?.path || undefined;
  try {
    const user = await User.findByIdAndUpdate(
      { _id },
      {
        avatar,
      },
      { new: true, upsert: true, projection: { password: 0 } }
    ).populate("friends.user", "userName avatar _id name"); // send new avatar image url to database, replace existing
    if (!user) return res.status(401).json({ error });
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const changeDefaultAvatar = async (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      { _id },
      {
        avatar,
      },
      { new: true, upsert: true, projection: { password: 0 } }
    ).populate("friends.user", "userName avatar _id name"); // send default avatar image url to database, replace existing
    if (!user) return res.status(401).json({ error });
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changeSettings = async (req, res) => {
  const { _id } = req.user; // get user._id from req (attached via auth)
  const {
    // name,
    password,
    darkMode,
    foundBy,
    locationServices,
    showEmail,
    showName,
  } = req.body;
  console.log(req.body);
  try {
    // send error if no or wrong file
    console.log(avatar);
    const user = await User.findByIdAndUpdate(
      { _id },
      {
        // adapt!!!!!!!!!!!!!!!!
        $addToSet: { "settings.poi": { $each: poi } },
        "settings.foundBy": foundBy,
        "settings.locationServices": locationServices,
        "settings.showEmail": showEmail,
        "settings.showName": showName,
      },
      { new: true, upsert: true, projection: { password: 0 } }
    ).populate("friends.user", "userName avatar _id name"); // send new avatar image url to database, replace existing
    if (!user) return res.status(401).json({ error });
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const setInitialSettings = async (req, res) => {
  const { _id } = req.user; // get user._id from req (attached via auth)
  const { poi, foundBy, locationServices, showEmail, showName } = req.body;
  console.log(req.body);
  try {
    const user = await User.findByIdAndUpdate(
      { _id },
      {
        $addToSet: { "settings.poi": { $each: poi } },
        "settings.foundBy": foundBy,
        "settings.locationServices": locationServices,
        "settings.showEmail": showEmail,
        "settings.showName": showName,
      },
      { new: true, upsert: true, projection: { password: 0 } }
    ).populate("friends.user", "userName avatar _id name"); // send new avatar image url to database, replace existing
    if (!user) return res.status(401).json({ error });

    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// find users via name/username/email

const findUsersByContact = async (req, res) => {
  const { search } = req.query; // endpoint: http://localhost:8080/user/find?search=ada
  const { _id } = req.user;
  if (!search)
    return res.status(200).json({ msg: "No query entered", data: [] });

  try {
    const users = await User.find(
      {
        // returns array of users with the search term in userName, name or email and settings on "public"
        $and: [
          {
            $or: [
              // WHERE name LIKE "%ada%"
              { name: { $regex: search, $options: "i" } }, // matches the fields with search term,
              { userName: { $regex: search, $options: "i" } }, // incomplete and case insensitive, "ada" matches "Adam", "cadavre@bla.com" or "Ladadriver87"
              { email: { $regex: search, $options: "i" } }, // also "gmail" will retrieve all users with such an email domain :(
            ],
          },
          {
            $or: [
              { "settings.foundBy": "all" },
              { "settings.foundBy": "friends" }, // needs to be fleshed out
            ],
          },
          { _id: { $not: { $eq: _id } } },
        ],
      },
      { userName: 1, avatar: 1, name: 1 } // retrieves only _id, username and avatar
    );
    if (!users) return res.status(200).json({ msg: "No matching user found" });
    else res.status(200).json({ data: users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Invite other User as friend

const inviteUserAsFriend = async (req, res) => {
  const { _id } = req.user;
  const { invitedUserId } = req.params;
  try {
    // find the invited user by her/his id; add the inviting user to list, set status to accepted:false, received:true
    // with received:true we can render an AcceptInvitation component in the front-end
    const invitedUser = await User.findByIdAndUpdate(
      { _id: invitedUserId },
      { $addToSet: { friends: { user: _id, received: true } } },
      { new: true }
    );
    // console.log(invitedUser);
    // find the inviting user, add invited one to friends list, set status to accepted:false, received:false -> now the invited needs to accept
    const user = await User.findByIdAndUpdate(
      { _id },
      { $addToSet: { friends: { user: invitedUser._id } } },
      { new: true, projection: { password: 0 } }
    ).populate("friends.user", "userName avatar _id name");
    if (!invitedUser || !user)
      return res.status(200).json({ msg: "No matching user found" });
    else res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Accept/reject friend invitation --> if user has a friend with status received:true, she is able to accept or reject on click
// Works as friend deletion too
const handleInvitation = async (req, res) => {
  const { _id } = req.user;
  const { invitingUserId, accepted, received } = req.body;

  // maybe the ids need to be cast to the proper type?
  // const userId = new mongoose.Types.ObjectId(_id);
  // const invitingUserCastId = new mongoose.Types.ObjectId(invitingUserId);

  // console.log("user_id: ", userId, "invitingUser: ", invitingUserCastId);

  try {
    if (accepted && received) {
      // select the inviting user and get the accepting user in the friends array
      const invitingUser = await User.findOneAndUpdate(
        { _id: invitingUserId, "friends.user": _id },
        // update status, the $ is the {"friends.user": _id} match - so we select the friend with that _id and update accepted and received
        { $set: { "friends.$.accepted": true, "friends.$.received": false } },
        { new: true }
      );

      const user = await User.findOneAndUpdate(
        { _id, "friends.user": invitingUserId },
        { $set: { "friends.$.accepted": true, "friends.$.received": false } },
        { new: true, projection: { password: 0 } }
      ).populate("friends.user", "userName avatar _id name");

      if (!invitingUser || !user)
        return res.status(200).json({ msg: "No matching user found" });
      return res.status(200).json({ data: user });
    } else if (!accepted) {
      // if rejected delete friends entry in both users
      const invitingUser = await User.findOneAndUpdate(
        { _id: invitingUserId },
        { $pull: { friends: { user: _id } } }
      );
      const user = await User.findOneAndUpdate(
        { _id },
        { $pull: { friends: { user: invitingUserId } } },
        { new: true, projection: { password: 0 } }
      ).populate("friends.user", "userName avatar _id name");
      if (!invitingUser || !user)
        return res.status(200).json({ msg: "No matching user found" });
      return res.status(200).json({ data: user });
    } else
      return res
        .status(200)
        .json({ msg: "You cannot accept your own invitation" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  const { userId } = req.params
  try {
    const user = await User.findById(userId)

    if (!user) return res.status(200).json({ msg: "No matching user found" });
    else res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getChatMembers = async (req, res) => {
  const {members} = req.body;
  try {

    const usersArray = members.map(user => {return { _id: user}})
  
    const usersFetched = await User.find({$or: [...usersArray]})
    if (!usersFetched) return res.status(200).json({ msg: "No matching users found" })
    else res.status(200).json({ data: usersFetched })
  }
   catch (error) {
    res.status(400).json({ error: error.message })
  }
}
// Add chatroom

// Get initial user settings / update user settings

module.exports = {
  loginUser,
  signUpUser,
  changeAvatar,
  changeDefaultAvatar,
  changeSettings,
  setInitialSettings,
  findUsersByContact,
  inviteUserAsFriend,
  handleInvitation,
  retrieveUser,
  getUser,
  getChatMembers,
};
