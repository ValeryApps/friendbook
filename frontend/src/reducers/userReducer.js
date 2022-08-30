import cookie from "js-cookie";

export const LOGIN = "LOGIN";
export const VERIFY = "VERIFY";
export const UPDATE_PROFILE_PICTURE = "UPDATE_PROFILE_PICTURE";
export const LOGOUT = "LOGOUT";
const userFromCookies = cookie.get("user")
  ? JSON.parse(cookie.get("user"))
  : null;
// const userInitialState = {
//   user: userFromCookies,
// };
export const userReducer = (state = userFromCookies, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return {
        ...state,
        payload,
      };
    case VERIFY:
      return {
        ...state,
        payload,
      };
    case UPDATE_PROFILE_PICTURE:
      return {
        ...state,
        picture: payload,
      };
    case LOGOUT:
      return {
        payload: null,
      };
    default:
      return state;
  }
};
