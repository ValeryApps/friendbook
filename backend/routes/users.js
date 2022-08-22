const express = require("express");
const {
  register,
  activateAccount,
  login,
  resendVerification,
  findUser,
  sendResetPasswordCode,
  verifyCode,
  changePassword,
  getProfile,
} = require("../controllers/user");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/users/register", register);
router.post("/users/activate", auth, activateAccount);
router.post("/users/login", login);
router.post("/users/resendVerification", auth, resendVerification);
router.post("/users/findUser", auth, findUser);
router.post("/users/sendResetPasswordCode", auth, sendResetPasswordCode);
router.post("/users/verifyCode", auth, verifyCode);
router.post("/users/changePassword", auth, changePassword);
router.get("/profile/:username", auth, getProfile);
module.exports = router;
