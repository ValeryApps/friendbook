const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
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
    return res.status(500).json({ message: error.message });
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
      return res.status(400).json({ message: "Invalid Credentials" });
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
    return res.status(500).json({ message: error.message });
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
    return res.status(500).json({ message: error.message });
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
    return res.status(500).json({ message: error.message });
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
    return res.status(500).json({ message: error.message });
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
    return res.status(500).json({ message: error.message });
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
    return res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findById(req.user.id);
    const profile = await User.findOne({ username })
      .select("-password")
      .populate("friends", "first_name last_name username picture");
    const friendship = {
      friend: false,
      following: false,
      follower: false,
      sentRequest: false,
      receivedRequest: false,
    };
    if (user.friends.includes(profile._id)) {
      friendship.friend = true;
    }
    if (user.following.includes(profile._id)) {
      friendship.following = true;
    }
    if (user.followers.includes(profile._id)) {
      friendship.follower = true;
    }
    if (user.requests.includes(profile._id)) {
      friendship.receivedRequest = true;
    }
    if (profile.requests.includes(user._id)) {
      friendship.sentRequest = true;
    }

    if (!profile) {
      return res.json({ ok: "false" });
    }
    const posts = await Post.find({ user: profile._id })
      .populate("user")
      .populate({
        path: "comments",
      })
      .sort({ createdAt: -1 });
    return res.json({ ...profile.toObject(), posts, friendship });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.updateProfilePicture = async (req, res) => {
  const id = req.user.id;
  const { url } = req.body;
  try {
    const picture = await User.findByIdAndUpdate(id, { picture: url });
    return res.json({ picture });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateCoverPicture = async (req, res) => {
  const id = req.user.id;
  const { url } = req.body;
  try {
    const picture = await User.findByIdAndUpdate(id, { cover: url });
    return res.json({ picture });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.updateUserDetails = async (req, res) => {
  const id = req.user.id;
  const { infos } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      id,
      { details: infos },
      { new: true }
    );
    return res.json(updated.details);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.sendRequest = async (req, res) => {
  const sender_id = req.user.id;
  const receiver_id = req.params.id;
  try {
    if (sender_id === receiver_id) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }
    const sender = await User.findById(sender_id);
    const receiver = await User.findById(receiver_id);
    if (
      sender.requests.includes(receiver_id) ||
      receiver.requests.includes(sender_id)
    ) {
      return res.status(400).json({
        message:
          "You have already sent or received a friend request to or from this user",
      });
    }
    if (sender.friends.includes(receiver_id)) {
      return res
        .status(400)
        .json({ message: "you are already friend with this user" });
    }
    let response;
    response = await receiver.updateOne({
      $push: { requests: sender_id },
    });
    response = await receiver.updateOne({
      $push: { followers: sender_id },
    });
    response = await sender.updateOne({
      $push: { following: receiver_id },
    });
    return res.json({ message: "Friend request sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.sendRequest = async (req, res) => {
  const sender_id = req.user.id;
  const receiver_id = req.params.id;
  try {
    if (sender_id === receiver_id) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }
    const sender = await User.findById(sender_id);
    const receiver = await User.findById(receiver_id);
    if (
      sender.requests.includes(receiver_id) ||
      receiver.requests.includes(sender_id)
    ) {
      return res.status(400).json({
        message:
          "You have already sent or received a friend request to or from this user",
      });
    }
    if (sender.friends.includes(receiver_id)) {
      return res
        .status(400)
        .json({ message: "you are already friend with this user" });
    }

    response = await receiver.updateOne({
      $push: { requests: sender_id },
    });
    response = await receiver.updateOne({
      $push: { followers: sender_id },
    });
    response = await sender.updateOne({
      $push: { following: receiver_id },
    });
    return res.json({ message: "Friend request sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.cancelRequest = async (req, res) => {
  const sender_id = req.user.id;
  const receiver_id = req.params.id;
  try {
    if (sender_id === receiver_id) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }
    const sender = await User.findById(sender_id);
    const receiver = await User.findById(receiver_id);
    if (!receiver.requests.includes(sender_id)) {
      return res.status(400).json({
        message: "You had sent no friend request to this user",
      });
    }
    if (sender.friends.includes(receiver_id)) {
      return res.status(400).json({
        message: "This user is your friend. You can only unfriend him/her",
      });
    }

    response = await receiver.updateOne({
      $pull: { requests: sender_id },
    });
    response = await receiver.updateOne({
      $pull: { followers: sender_id },
    });
    response = await sender.updateOne({
      $pull: { following: receiver_id },
    });
    return res.json({ message: "Friend request cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.follow = async (req, res) => {
  const sender_id = req.user.id;
  const receiver_id = req.params.id;
  try {
    if (sender_id === receiver_id) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
    const sender = await User.findById(sender_id);
    const receiver = await User.findById(receiver_id);
    if (
      receiver.followers.includes(sender_id) ||
      receiver.requests.includes(sender_id)
    ) {
      return res.status(400).json({
        message: "You are already following this user",
      });
    }

    if (sender.friends.includes(receiver_id)) {
      return res.status(400).json({
        message: "This user is your friend. You can only unfriend him/her",
      });
    }

    response = await receiver.updateOne({
      $push: { followers: sender_id },
    });
    response = await sender.updateOne({
      $push: { following: receiver_id },
    });

    return res.json({ message: "You are now following this user" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.unfollow = async (req, res) => {
  const sender_id = req.user.id;
  const receiver_id = req.params.id;
  try {
    if (sender_id === receiver_id) {
      return res.status(400).json({ message: "You can't unfollow yourself" });
    }
    const sender = await User.findById(sender_id);
    const receiver = await User.findById(receiver_id);
    if (!receiver.followers.includes(sender_id)) {
      return res.status(400).json({
        message: "You were not following this user",
      });
    }
    if (sender.friends.includes(receiver_id)) {
      return res.status(400).json({
        message: "This user is your friend. You can only unfriend him/her",
      });
    }
    response = await receiver.updateOne({
      $pull: { followers: sender_id },
    });
    response = await sender.updateOne({
      $pull: { following: receiver_id },
    });

    return res.json({ message: "You are no longer following this user" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.acceptRequest = async (req, res) => {
  const receiver_id = req.user.id;
  const sender_id = req.params.id;
  try {
    const sender = await User.findById(sender_id);
    const receiver = await User.findById(receiver_id);
    if (!receiver.requests.includes(sender_id)) {
      return res.status(400).json({
        message: "This user didn't send you any request",
      });
    }
    if (
      sender.friends.includes(receiver_id) ||
      receiver.friends.includes(sender_id)
    ) {
      return res.status(400).json({
        message:
          "This user is already your friend. You can only unfriend him/her",
      });
    }
    response = await receiver.update({
      $push: { friends: sender_id, following: sender_id },
    });
    response = await sender.update({
      $push: { friends: receiver_id, followers: receiver_id },
    });
    response = await receiver.updateOne({
      $pull: { requests: sender_id },
    });

    return res.json({ message: "You are now friend with this user" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.unfriend = async (req, res) => {
  const me_id = req.user.id;
  const friend_id = req.params.id;
  try {
    const me = await User.findById(me_id);
    const friend = await User.findById(friend_id);
    if (!me.friends.includes(friend_id) && !friend.friends.includes(me_id)) {
      return res.status(400).json({
        message: "This user is not your friend",
      });
    }
    response = await me.update({
      $pull: { friends: friend_id, following: friend_id, followers: friend_id },
    });
    response = await friend.update({
      $pull: { friends: me_id, followers: me_id, following: me_id },
    });
    return res.json({ message: "You have unfollowed this user" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.deleteRequest = async (req, res) => {
  const me_id = req.user.id;
  const sender_id = req.params.id;
  try {
    const me = await User.findById(me_id);
    const sender = await User.findById(sender_id);
    if (!me.requests.includes(sender_id)) {
      return res.status(400).json({
        message: "This user hasn't sent you any friend request",
      });
    }
    response = await me.update({
      $pull: { requests: sender_id, followers: sender_id },
    });
    response = await sender.update({
      $pull: { following: me_id },
    });
    return res.json({
      message: "You have successfully deleted the friend request",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
