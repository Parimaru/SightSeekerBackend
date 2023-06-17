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

    res.status(200).json({ data: user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// sign up user
const signUpUser = async (req, res) => {
  const { email, password, userName, name } = req.body;

  try {
    const user = await User.signup(email, password, userName, name);
    //create token
    const token = createToken(user._id);
    res.status(201).json({ data: user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// add/change an avatar

const addAvatarUser = async (req, res) => {
  const { _id } = req.user; // get user._id from req (attached via auth)

  try {
    if (!req.file || !req.file.path) return res.status(422).json({ error }); // send error if no or wrong file

    const avatar = req.file.path;
    const user = await User.findByIdAndUpdate(
      { _id },
      { avatar },
      { new: true }
    ); // send new avatar image url to database, replace existing

    if (!user) return res.status(401).json({ error });

    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// find users via name/username/email

const findUsersByContact = async (req, res) => {
  const { search } = req.query; // endpoint: http://localhost:8080/user/find?search=ada
  try {
    const users = await User.find({
      // returns array of users with the search term in userName, name or email and settings on "public"
      $and: [
        {
          $or: [
            { name: { $regex: search, $options: "i" } }, // matches the fields with search term,
            { userName: { $regex: search, $options: "i" } }, // incomplete and case insensitive, "ada" matches "Adam", "cadavre@bla.com" or "Ladadriver87"
            { email: { $regex: search, $options: "i" } }, // but "gmail" will retrieve all users with such an address :(
          ],
        },
        { settings: "public" },
      ],
    });
    if (!users) res.status(200).json({ msg: "No matching user found" });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signUpUser, addAvatarUser, findUsersByContact };
