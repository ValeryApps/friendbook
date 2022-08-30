import axios from "axios";
import "./profile.css";
import { useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import Cover from "../../components/profile/Cover";
import {
  initialState,
  profileReducer,
  FETCH_PROFILE_START,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_ERROR,
} from "../../reducers/profileReducer";
import { useClickOutside } from "../../helpers/clickOutside";
import ProfilePictureInfo from "../../components/profile/ProfilePictureInfo";
import ProfileMenu from "../../components/profile/ProfileMenu";
import PeopleYouMayKnow from "../../components/profile/PeopleYouMayKnow";
import CreatePost from "../../components/createPost/index";
import GridPost from "../../components/profile/GridPost";
import Post from "../../components/post/Post";
import Photos from "../../components/profile/Photos";
import {
  FETCH_PHOTOS_ERROR,
  FETCH_PHOTOS_START,
  FETCH_PHOTOS_SUCCESS,
  initial_photo_State,
  photoReducer,
} from "../../reducers/photoReducer";
import Friends from "../../components/profile/Friends";
import Intro from "../../components/intro/intro";

const url = `${process.env.REACT_APP_URL}`;

export default function Profile({ setVisible }) {
  const navigate = useNavigate();
  const [menuShown, setMenuShown] = useState(false);
  const [otherName, setOtherName] = useState();
  const { user } = useSelector((state) => ({ ...state }));
  const initUser = user?.payload ? user.payload : user;

  let { username } = useParams();
  const coverRef = useRef(null);

  useClickOutside(coverRef, () => {
    setMenuShown(false);
  });
  username = username === undefined ? initUser?.username : username;
  const [{ profile, error, loading }, dispatch] = useReducer(
    profileReducer,
    initialState
  );

  const [{ photos, error_photos, loading_photos }, dispatch_photo] = useReducer(
    photoReducer,
    initial_photo_State
  );
  const getProfile = async () => {
    dispatch({ type: FETCH_PROFILE_START });
    try {
      const { data } = await axios.get(`${url}/profile/${username}`, {
        headers: {
          Authorization: `Bearer ${initUser.token}`,
        },
      });
      if (data.ok === false) {
        navigate("/profile");
      } else {
        dispatch({ type: FETCH_PROFILE_SUCCESS, payload: data });
        getPhotos();
      }
    } catch (error) {
      dispatch({ type: FETCH_PROFILE_ERROR });
      console.log(error);
    }
  };
  const getPhotos = async () => {
    dispatch_photo({ type: FETCH_PHOTOS_START });
    try {
      const { data } = await axios.post(
        `${url}/images`,
        { path: `${username}*`, max: 30, sort: "desc" },
        {
          headers: {
            Authorization: `Bearer ${initUser.token}`,
          },
        }
      );
      dispatch_photo({ type: FETCH_PHOTOS_SUCCESS, payload: data });
    } catch (error) {
      dispatch_photo({ type: FETCH_PHOTOS_ERROR });
      console.log(error);
    }
  };

  useEffect(() => {
    if (!initUser) {
      navigate("/login");
      return;
    }

    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initUser, navigate]);
  useEffect(() => {
    setOtherName(profile?.details?.otherName);
  }, [profile]);
  const itIsMe = initUser?.username === username;

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (error) {
    return <h3>There was an error</h3>;
  }

  return (
    <div className="profile" style={{ marginBottom: "2rem" }}>
      <Header page="profile" />
      <div className="profile_top">
        <div className="profile_container">
          <Cover
            cover={profile?.cover}
            setMenuShown={setMenuShown}
            menuShown={menuShown}
            coverRef={coverRef}
            itIsMe={itIsMe}
            user={initUser}
            photos={photos.resources}
          />
          <ProfilePictureInfo
            profile={profile}
            itIsMe={itIsMe}
            photos={photos.resources}
            user={initUser}
            otherName={otherName}
            friendship_status={profile?.friendship}
          />
          <ProfileMenu />
        </div>
      </div>
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            <PeopleYouMayKnow />
          </div>
          <div className="profile_grid">
            <div className="profile_left">
              <Intro
                user={initUser}
                itIsMe={itIsMe}
                detailss={profile?.details}
                setOtherName={setOtherName}
              />
              <Photos
                photos={photos}
                loading={loading_photos}
                error={error_photos}
              />
              <Friends friends={profile?.friends} />
              <div className="relative_fb_copyright">
                <Link to="/">Privacy </Link>
                <span>. </span>
                <Link to="/">Terms </Link>
                <span>. </span>
                <Link to="/">Advertising </Link>
                <span>. </span>
                <Link to="/">
                  Ad Choices <i className="ad_choices_icon"></i>{" "}
                </Link>
                <span>. </span>
                <Link to="/"></Link>Cookies <span>. </span>
                <Link to="/">More </Link>
                <span>. </span> <br />
                Meta © 2022
              </div>
            </div>
            <div className="profile_right">
              <CreatePost user={initUser} profile setVisible={setVisible} />
              <GridPost itIsMe={itIsMe} />
              <div className="posts">
                {profile?.posts && profile?.posts.length > 0 ? (
                  <>
                    {profile?.posts?.map((post) => (
                      <Post
                        post={post}
                        key={post._id}
                        user={initUser}
                        itIsMe={itIsMe}
                      />
                    ))}
                  </>
                ) : (
                  <div className="no_posts">No posts available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
