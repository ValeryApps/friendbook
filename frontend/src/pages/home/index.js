import { useSelector } from "react-redux";
import Header from "../../components/header";
import LeftHome from "../../components/home/left/index";
import RightHome from "../../components/home/right/index";
import Stories from "../../components/home/stories/index";
import "./home.css";
import CreatePost from "../../components/createPost/index";
import ResendLink from "../../components/home/resend_email/ResendLink";
// import cookies from "js-cookie";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  initialState,
  postReducer,
} from "../../reducers/postReducer";
import axios from "axios";
import Post from "../../components/post/Post";

const url = `${process.env.REACT_APP_URL}/posts/all_posts`;
const Home = ({ setVisible }) => {
  let { user } = useSelector((state) => ({ ...state }));

  const middle = useRef(null);
  const [height, setHeight] = useState();
  const [{ posts, error, loading }, dispatch] = useReducer(
    postReducer,
    initialState
  );

  // eslint-disable-next-line no-unused-vars
  const fetchPosts = async () => {
    dispatch({ type: FETCH_START });
    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      dispatch({ type: FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_ERROR, payload: error });
    }
  };
  // fetchPosts();

  useEffect(() => {
    setHeight(middle.current.clientHeight);
  }, []);
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>There was an error</div>;
  return (
    <div className="home" style={{ height: `${height + 150}px` }}>
      <Header page="home" />
      <LeftHome user={user} />
      <div className="home_middle" ref={middle}>
        <Stories />
        {!user.verified && <ResendLink />}
        <CreatePost user={user} setVisible={setVisible} />
        <div className="posts">
          {posts.map((post) => (
            <Post post={post} key={post._id} user={user} />
          ))}
        </div>
      </div>
      <RightHome user={user} />
    </div>
  );
};

export default Home;
