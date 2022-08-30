const express = require("express");
const {
  createPost,
  getPosts,
  comment,
} = require("../controllers/postController");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.post("/posts", auth, createPost);
router.get("/posts/all_posts", auth, getPosts);
// router.put("/posts/comment", auth, comment);

module.exports = router;
