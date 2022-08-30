import axios from "axios";
const url = `${process.env.REACT_APP_URL}/posts/`;
const reactUrl = `${process.env.REACT_APP_URL}/react/`;
const commentUrl = `${process.env.REACT_APP_URL}/comment`;
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

export const reactToPost = async (react, postId, token) => {
  try {
    const { data } = await axios.post(
      reactUrl,
      { react, postId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const getReacts = async (postId, token) => {
  try {
    const { data } = await axios.get(`${reactUrl}${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const comment = async (postId, token, comment, image) => {
  try {
    const { data } = await axios.post(
      commentUrl,
      { comment, image, postId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const getComments = async (postId, token) => {
  try {
    const { data } = await axios.get(`${commentUrl}/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
