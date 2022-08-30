import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./post.css";
import Moment from "react-moment";
import { Dots, Public } from "../../svg";
import ReactPopup from "./ReactPopup";
import CreateComment from "./CreateComment";
import PostMenu from "./PostMenu";
import { getComments, getReacts, reactToPost } from "../../functions/post";
import { useEffect } from "react";
import Comment from "./Comment";

const Post = ({ post, user, itIsMe }) => {
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [react, setReact] = useState();
  const [allReacts, setAllReacts] = useState([]);
  const [comments, setComments] = useState([]);
  // const [react, setReact] = useState("");
  const [userReacted, setUserReacted] = useState(false);

  useEffect(() => {
    getReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [react]);

  const getReact = async () => {
    const data = await getReacts(post?._id, user?.token);

    setReact(data?.react?.react);
    setUserReacted(data?.react?.reactBy === user.id);
    setAllReacts(data?.allReacts);
  };
  const get_comments = async () => {
    const comm = await getComments(post?._id, user?.token);
    setComments(comm);
  };
  useEffect(() => {
    get_comments();
  }, [post]);
  const handleReactToPost = async (type) => {
    try {
      const res = await reactToPost(type, post?._id, user?.token);
      setReact(res.react);
    } catch (error) {}
  };
  const reactArray = allReacts?.reduce((group, react) => {
    const key = react.react;
    group[key] = group[key] || [];
    group[key].push(react);
    return group;
  }, {});
  const reacts = [
    { react: "like", count: reactArray.like ? reactArray.like.length : 0 },
    { react: "love", count: reactArray.love ? reactArray.love.length : 0 },
    { react: "haha", count: reactArray.haha ? reactArray.haha.length : 0 },
    { react: "wow", count: reactArray.wow ? reactArray.wow.length : 0 },
    { react: "angry", count: reactArray.angry ? reactArray.angry.length : 0 },
  ];

  return (
    <div className="post">
      <div className="post_header">
        <Link
          to={`/profile/${post?.user?.username}`}
          className="post_header_left"
        >
          <img src={post?.user.picture} alt={post?.user?.username} />
          <div className="post_col">
            <div className="post_profile_name">
              {post?.user.first_name} {post?.user.last_name}
              <div className="updated_p">
                {post.type === "profilePicture" &&
                  `updated ${
                    post?.user.gender === "male" ? "his" : "her"
                  } profile picture`}
                {post.type === "cover" &&
                  `updated ${
                    post?.user.gender === "male" ? "his" : "her"
                  } cover picture`}
              </div>
            </div>
            <div className="post_date">
              <Moment fromNow interval={30000}>
                {post.createdAt}
              </Moment>
              <Public color="#828387" />
            </div>
          </div>
        </Link>
        <div
          className="post_right hover1"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <Dots color="#828387" />
        </div>
      </div>
      {post.background ? (
        <div
          className="post_bg"
          style={{ backgroundImage: `url(${post.background})` }}
        >
          {post.text}
        </div>
      ) : post.type === null ? (
        <>
          <div className="post_text">{post.text}</div>
          {post.images && post.images.length && (
            <div
              className={
                post.images.length === 1
                  ? "grid_1"
                  : post.images.length === 2
                  ? "grid_2"
                  : post.images.length === 3
                  ? "grid_3"
                  : post.images.length === 4
                  ? "grid_4"
                  : post.images.length >= 5 && "grid_5"
              }
            >
              {post.images.slice(0, 5).map((image, i) => (
                <img src={image.url} key={i} alt="" className={`img-${i}`} />
              ))}
              {post.images.length > 5 && (
                <div className="more-pics-shadow">
                  +{post.images.length - 5}
                </div>
              )}
            </div>
          )}
        </>
      ) : post.type === "profilePicture" ? (
        <div className="post_profile_wrap">
          <div className="post_updated_bg">
            <img src={post.user.cover} alt="" />
          </div>
          <img
            src={post.images[0].url}
            alt=""
            className="post_updated_picture"
          />
        </div>
      ) : (
        <div className="post_cover_wrap">
          <div className="cover_updated_bg">
            <img src={post.images[0].url} alt="" />
          </div>
        </div>
      )}
      <div className="post_info">
        <div className="reacts_count">
          <div className="reacts_count_img">
            {reacts?.map(
              (react, i) =>
                react.count > 0 && (
                  <img
                    key={i}
                    src={`../../../reacts/${react?.react}.svg`}
                    alt=""
                  />
                )
            )}
          </div>
          {allReacts?.length > 0 && (
            <div className="reacts_count_num">{allReacts?.length}</div>
          )}
        </div>
        <div className="to_left">
          <div className="comments_count">
            {`${
              comments.length > 1
                ? `${comments.length} comments`
                : `${comments.length} comment`
            }`}
          </div>
          <div className="share_count">2 shares</div>
        </div>
      </div>
      <div className="post_actions">
        <ReactPopup
          visible={visible}
          setVisible={setVisible}
          handleReactToPost={handleReactToPost}
        />
        <div
          className="post_action hover1"
          onMouseOver={() =>
            setTimeout(() => {
              setVisible(true);
            }, 500)
          }
          onMouseLeave={() =>
            setTimeout(() => {
              setVisible(false);
            }, 1500)
          }
          onClick={() => handleReactToPost(!react ? "like" : react)}
        >
          {userReacted ? (
            <div
              className="small_icon"
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <img
                src={`../../../reacts/${react}.svg`}
                alt=""
                style={{ width: "16px", height: "16px" }}
              />
              <span
                title={
                  allReacts?.length === 1
                    ? `${allReacts?.length} person reacted to this post`
                    : `${allReacts?.length} people reacted to this post`
                }
              >
                {react}
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "3px" }}>
              {" "}
              <i className="like_icon"></i>
              <span title="Nobody has reacted to this post yet. Be the first">
                Like
              </span>
            </div>
          )}
        </div>
        <div className="post_action hover1">
          <i className="comment_icon"></i>
          <span>Comment</span>
        </div>
        <div className="post_action hover1">
          <i className="share_icon"></i>
          <span>Share</span>
        </div>
      </div>
      {comments &&
        comments
          .slice(0, 3)
          .map((comment) => <Comment key={comment._id} comment={comment} />)}
      <div className="comments_wrap">
        <div className="comments_order">
          <CreateComment postId={post?._id} />
        </div>
      </div>
      {showMenu && (
        <PostMenu
          userId={user.id}
          postUserId={post.user._id}
          imagesLength={post?.images?.length}
          setShowMenu={setShowMenu}
          itIsMe={itIsMe}
        />
      )}
    </div>
  );
};

export default Post;
