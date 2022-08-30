const express = require("express");
const { comment, getComments } = require("../controllers/comment");
const { auth } = require("../middlewares/auth");

const router = express.Router();
router.post("/comment", auth, comment);
router.get("/comment/:postRef", auth, getComments);

module.exports = router;
