const mongoose = require("mongoose");
const React = require("../models/React");

exports.reactToPost = async (req, res) => {
  const { react, postId } = req.body;
  const userId = req.user.id;
  try {
    const existingReact = await React.findOne({
      postRef: postId,
      reactBy: mongoose.Types.ObjectId(userId),
    });
    if (!existingReact) {
      const response = await React({
        react,
        postRef: postId,
        reactBy: userId,
      }).save();
      return res.json(response);
    } else {
      if (existingReact.react === react) {
        await React.findByIdAndRemove(existingReact._id);
        return res.json({ response: "react Removed" });
      } else {
        const response = await React.findByIdAndUpdate(
          existingReact._id,
          {
            react,
          },
          { new: true }
        );
        return res.json(response);
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getReacts = async (req, res) => {
  const { postId } = req.params;
  try {
    const react = await React.findOne({
      postRef: postId,
      reactBy: req.user.id,
    });
    const allReacts = await React.find({ postRef: postId });
    return res.status(200).json({ react, allReacts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
