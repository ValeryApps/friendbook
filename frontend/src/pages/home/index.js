import { useSelector } from "react-redux";
import Header from "../../components/header";
import LeftHome from "../../components/home/left/index";
import RightHome from "../../components/home/right/index";
import Stories from "../../components/home/stories/index";
import "./home.css";
import CreatePost from "../../components/createPost/index";
import ResendLink from "../../components/home/resend_email/ResendLink";
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
import { useNavigate } from "react-router-dom";

const url = `${process.env.REACT_APP_URL}/posts/all_posts`;
const Home = ({ setVisible }) => {
  let { user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();

  const initUser = user?.payload ? user?.payload : user;

  const middle = useRef(null);
  const [height, setHeight] = useState();
  const [{ posts, error, loading }, dispatch] = useReducer(
    postReducer,
    initialState
  );

  useEffect(() => {
    if (!initUser?.token) {
      navigate("/login");
      return;
    }
    const fetchPosts = async () => {
      dispatch({ type: FETCH_START });
      try {
        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${initUser?.token}`,
          },
        });
        const postsArray = [];
        data.forEach((post) => {
          if (
            post.user?.following?.includes(initUser.id) ||
            post.user._id === initUser.id
          ) {
            postsArray.push(post);
          }
        });
        dispatch({ type: FETCH_SUCCESS, payload: postsArray });
      } catch (error) {
        dispatch({ type: FETCH_ERROR, payload: error });
      }
    };
    fetchPosts();
  }, [initUser, dispatch, navigate]);

  useEffect(() => {
    setHeight(middle?.current?.clientHeight);
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <div className="home" style={{ height: `${height + 150}px` }}>
      <Header page="home" />
      <LeftHome user={initUser} />
      <div className="home_middle" ref={middle}>
        <Stories />
        {!initUser?.verified && <ResendLink />}
        <CreatePost user={initUser} setVisible={setVisible} />
        <div className="posts">
          {posts?.map((post) => (
            <Post
              post={post}
              key={post._id}
              user={initUser}
              itIsMe={post?.user?.username === initUser?.username}
            />
          ))}
        </div>
      </div>
      <RightHome user={initUser} />
    </div>
  );
};

export default Home;
