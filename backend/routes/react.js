const express = require("express");
const { reactToPost, getReacts } = require("../controllers/react");
const { auth } = require("../middlewares/auth");

const router = express.Router();
router.post("/react", auth, reactToPost);
router.get("/react/:postId", auth, getReacts);

module.exports = router;
