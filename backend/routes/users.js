const express = require("express");
const { register, activateAccount, login } = require("../controllers/user");

const router = express.Router();

router.post("/users/register", register);
router.post("/users/activate", activateAccount);
router.post("/users/login", login);

module.exports = router;
