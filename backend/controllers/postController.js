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
    return res.status(500).json({ message: error.message });
  }
};
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate(
        "user",
        "first_name last_name username picture gender cover friends"
      )

      .sort({ createdAt: "desc" });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// exports.comment = async (req, res) => {
//   const { comment, image, postId } = req.body;

//   try {
//     const post = await Post.findOne({ postId });
//     console.log(post);
//     return res.json(post);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
