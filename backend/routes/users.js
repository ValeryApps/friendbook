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
  updateProfilePicture,
  updateCoverPicture,
  updateUserDetails,
  sendRequest,
  cancelRequest,
  follow,
  unfollow,
  acceptRequest,
  unfriend,
  deleteRequest,
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
router.put("/profile/picture/update", auth, updateProfilePicture);
router.put("/profile/cover/update", auth, updateCoverPicture);
router.put("/profile/details/update", auth, updateUserDetails);
router.put("/profile/sendRequest/:id", auth, sendRequest);
router.put("/profile/cancelRequest/:id", auth, cancelRequest);
router.put("/profile/follow/:id", auth, follow);
router.put("/profile/unfollow/:id", auth, unfollow);
router.put("/profile/acceptRequest/:id", auth, acceptRequest);
router.put("/profile/unfriend/:id", auth, unfriend);
router.put("/profile/deleteRequest/:id", auth, deleteRequest);
module.exports = router;
