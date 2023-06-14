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

    res.status(200).json({ loginOne, token });
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
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signUpUser };
