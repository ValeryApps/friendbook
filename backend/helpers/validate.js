const User = require("../models/user");

exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};

exports.validateLength = (text, min, max) => {
  if (text.length > max || text.length < min) {
    return false;
  }
  return true;
};
exports.generateUsername = async (username) => {
  let a = false;
  do {
    const check = await User.findOne({ username });
    if (check) {
      username += (+new Date().getTime() * Math.random())
        .toString()
        .substring(0, 1);
      a = true;
    } else {
      a = false;
    }
  } while (a);
  return username;
};