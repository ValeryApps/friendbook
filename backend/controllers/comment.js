const { response } = require("express");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.comment = async (req, res) => {
  const { comment, postId, image } = req.body;
  try {
    const post = await Post.findById(postId);

    const com = await new Comment({
      comment,
      image,
      postRef: postId,
      commentBy: req.user.id,
    }).save();

    const updatedPost = await post.updateOne(
      {
        $push: { comments: com },
      },
      { new: true }
    );
    return res.json({ updatedPost, com });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  const { postRef } = req.params;
  try {
    const comments = await Comment.find({ postRef })
      .sort({ commentAt: -1 })
      .populate("commentBy", "first_name last_name picture username");
    return res.json(comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
