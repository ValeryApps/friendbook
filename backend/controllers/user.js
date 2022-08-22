const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  validateLength,
  generateUsername,
} = require("../helpers/validate");
const { generateToken } = require("../helpers/token");
const {
  sendVerificationEmail,
  sendVerificationCode,
} = require("../helpers/mailer");
const Code = require("../models/Code");
const { generateCode } = require("../helpers/generateCode");

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
    const url = `${process.env.BASE_URL}/activate/${token}`;
    sendVerificationEmail(user.email, user.first_name, url);
    return res.json({
      id: user._id,
      username: user.username,
      first_name,
      last_name,
      picture: user.picture,
      email,
      verified: user.verified,
      message: "Registration is successful. Please activate your email",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "There was a server error" });
  }
};

exports.activateAccount = async (req, res) => {
  const { token } = req.body;

  const user = jwt.verify(token, process.env.JWT_SECRET);
  const check = await User.findById(user.id);

  if (req.user.id !== check.id) {
    return res
      .status(400)
      .json({ message: "You are not authorized to use this resources" });
  }

  if (check?.verified) {
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
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      picture: user.picture,
      email,
      verified: user.verified,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "There was a server error" });
  }
};

exports.resendVerification = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "You are not authorized to use this resources" });
    }
    if (user?.verified) {
      return res
        .status(400)
        .json({ message: "This email is already activated" });
    }
    const token = generateToken(
      {
        id: user._id,
      },
      "1d"
    );
    const url = `${process.env.BASE_URL}/activate/${token}`;
    sendVerificationEmail(user.email, user.first_name, url);
    return res.json({
      message: "A new verification link has been sent to your email",
    });
  } catch (error) {
    return res.status(500).json({ message: "There was a server error" });
  }
};

exports.findUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(400).json({ message: "This account doesn't exist" });
    }
    return res.json({
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    return res.status(500).json({ message: "There was a server error" });
  }
};

exports.sendResetPasswordCode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).select("-password");
    if (user) {
      await Code.findOneAndRemove({ user: user._id });
    }
    const code = generateCode(6);

    const newCode = await new Code({
      code,
      user: user.id,
    }).save();
    sendVerificationCode(user.email, user.first_name, code);
    return res.json({
      message: "Password reset code sent to your email address",
    });
  } catch (error) {
    return res.status(500).json({ message: "There was a server error" });
  }
};
exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    const dbCode = await Code.findOne({ user: user.id });

    if (dbCode.code !== code) {
      return res
        .status(400)
        .json({ message: `The code ${code} you entered is invalid` });
    }
    return res.json({
      message: "Ok",
    });
  } catch (error) {
    return res.status(500).json({ message: "There was a server error" });
  }
};

exports.changePassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const encryptedPassword = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate({ email }, { password: encryptedPassword });
    return res.json({
      message: "Ok",
    });
  } catch (error) {
    return res.status(500).json({ message: "There was a server error" });
  }
};

exports.getProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const profile = await User.findOne({ username }).select("-password");
    if (!profile) {
      return res.json({ ok: "false" });
    }
    return res.json(profile);
  } catch (error) {
    return res.status(500).json("There was an unknown error");
  }
};
