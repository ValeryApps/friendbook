const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  validateLength,
  generateUsername,
} = require("../helpers/validate");
const { generateToken } = require("../helpers/token");
const { sendVerificationEmail } = require("../helpers/mailer");

exports.register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    picture,
    gender,
    bYear,
    bMonth,
    bDay,
  } = req.body;
  try {
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email!" });
    }
    if (!validateLength(first_name, 3, 30)) {
      return res.status(400).json({
        message: "First name must be between 3 and 30 characters long!",
      });
    }
    if (!validateLength(last_name, 3, 30)) {
      return res.status(400).json({
        message: "Last name must be between 3 and 30 characters long!",
      });
    }
    if (!validateLength(password, 6, 30)) {
      return res.status(400).json({
        message: "Password name must be between 3 and 30 characters long!",
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "email already exists. Please try another one" });
    }
    const generated_username = await generateUsername(first_name + last_name);

    const hashed_password = await bcrypt.hash(password, 12);
    user = await User({
      first_name,
      last_name,
      username: generated_username,
      email,
      password: hashed_password,
      picture,
      gender,
      bYear,
      bMonth,
      bDay,
    }).save();
    const token = generateToken(
      {
        id: user._id,
      },
      "1d"
    );
    const url = `${process.env.BASE_URL}/active/${token}`;
    sendVerificationEmail(user.email, user.first_name, url);
    res.json({
      user: {
        id: user._id,
        username: user.username,
        first_name,
        last_name,
        picture,
        email,
      },
      actions: {
        verified: user.verified,
        message: "Registration is successfull. Please activate your email",
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.activateAccount = async (req, res) => {
  const { token } = req.body;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  const check = await User.findById(user.id);
  if (check.verified) {
    return res.status(400).json({ message: "This email is already activated" });
  }
  await User.findByIdAndUpdate(user.id, { verified: true });
  return res.json({ message: "Account has successfully been activated" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "This email is not connected to an account" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentiels" });
    }
    const token = generateToken(
      {
        id: user._id,
      },
      "1d"
    );
    return res.json({
      user: {
        id: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        picture: user.picture,
        email,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
