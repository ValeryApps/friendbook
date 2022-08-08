import cookie from "js-cookies";

export const LOGIN = "LOGIN";
const userFromCookies = JSON.parse(cookie.getItem("user"));
const userInitialState = {
  users: userFromCookies,
};
export const userReducer = (state = userInitialState, { type, payload }) => {
  switch (type) {
    case "LOGIN":
      return payload;

    default:
      return state;
  }
};
