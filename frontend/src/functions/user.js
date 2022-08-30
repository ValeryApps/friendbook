import axios from "axios";
const backend_url = `${process.env.REACT_APP_URL}/profile`;

export const updateUserProfilePic = async (url, token) => {
  try {
    await axios.put(
      `${backend_url}/picture/update/`,
      { url },
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

export const updateUserCoverPic = async (url, token) => {
  try {
    await axios.put(
      `${backend_url}/cover/update/`,
      { url },
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
export const sendRequest = async (id, token) => {
  try {
    await axios.put(
      `${backend_url}/sendRequest/${id}/`,
      { id },
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
export const cancelRequest = async (id, token) => {
  try {
    await axios.put(
      `${backend_url}/cancelRequest/${id}/`,
      { id },
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
export const follow = async (id, token) => {
  try {
    await axios.put(
      `${backend_url}/follow/${id}/`,
      { id },
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
export const unfollow = async (id, token) => {
  try {
    await axios.put(
      `${backend_url}/unfollow/${id}/`,
      { id },
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
export const acceptRequest = async (id, token) => {
  try {
    await axios.put(
      `${backend_url}/acceptRequest/${id}/`,
      { id },
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
export const unfriend = async (id, token) => {
  try {
    await axios.put(
      `${backend_url}/unfriend/${id}/`,
      { id },
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
export const deleteRequest = async (id, token) => {
  try {
    await axios.put(
      `${backend_url}/deleteRequest/${id}/`,
      { id },
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
