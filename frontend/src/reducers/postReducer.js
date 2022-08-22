export const FETCH_START = "FETCH_START";
export const FETCH_ERROR = "FETCH_ERROR";
export const FETCH_SUCCESS = "FETCH_SUCCESS";

export const initialState = {
  posts: [],
  error: "",
  loading: false,
};
export const postReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_START:
      return {
        ...state,
        error: "",
        loading: true,
      };

    case FETCH_SUCCESS:
      return {
        ...state,
        posts: payload,
        error: "",
        loading: false,
      };
    case FETCH_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    default:
      return state;
  }
};
