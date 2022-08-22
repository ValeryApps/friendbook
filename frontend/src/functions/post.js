import axios from "axios";
const url = `${process.env.REACT_APP_URL}/posts/`;
export const createPost = async (
  user,
  token,
  text,
  background,
  images,
  type
) => {
  try {
    await axios.post(
      url,
      { user, text, background, images, type },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return "ok";
  } catch (error) {
    return error.response.data.message;
  }
};
