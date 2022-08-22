import axios from "axios";
import "./profile.css";
import { useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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

const url = `${process.env.REACT_APP_URL}/profile`;

export default function Profile() {
  const [menuShown, setMenuShown] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  let { username } = useParams();
  const coverRef = useRef(null);

  useClickOutside(coverRef, () => {
    console.log("menuShown");
    setMenuShown(false);
  });
  username = username === undefined ? user.username : username;
  const [{ profile, error, loading }, dispatch] = useReducer(
    profileReducer,
    initialState
  );

  useEffect(() => {
    const getProfile = async () => {
      dispatch({ type: FETCH_PROFILE_START });
      try {
        const { data } = await axios.get(`${url}/${username}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        dispatch({ type: FETCH_PROFILE_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: FETCH_PROFILE_ERROR });
        console.log(error);
      }
    };
    getProfile();
  }, [dispatch, user, username]);

  return (
    <div className="profile">
      <Header page="profile" />
      <div className="profile_top">
        <div className="profile_container">
          <Cover
            cover={profile.cover}
            setMenuShown={setMenuShown}
            menuShown={menuShown}
            coverRef={coverRef}
          />
          <ProfilePictureInfo profile={profile} />
          <ProfileMenu />
        </div>
      </div>
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom container">
            <PeopleYouMayKnow />
          </div>
        </div>
      </div>
    </div>
  );
}
