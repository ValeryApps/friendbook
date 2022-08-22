const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return;
    }
    const post = await Post(req.body).save();
    return res.json({ post });
  } catch (error) {
    return res.status(500).json({ message: "There was a server error" });
  }
};
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "first_name last_name username picture gender")
      .sort({ createdAt: "desc" });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: "There was a server error" });
  }
};
