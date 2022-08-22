import cookie from "js-cookie";

export const LOGIN = "LOGIN";
export const VERIFY = "VERIFY";
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
    case LOGOUT:
      return {
        ...state,
        payload: null,
      };
    default:
      return state;
  }
};
