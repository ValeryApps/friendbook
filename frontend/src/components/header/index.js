import { useRef } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import {
  Friends,
  HomeActive,
  Logo,
  Market,
  Search,
  Watch,
  Gaming,
  Menu,
  Notifications,
  Messenger,
  Home,
} from "../../svg/";
import SearchMenu from "./SearchMenu";
import { useState } from "react";
import AllMenu from "./AllMenu";
import { useClickOutside } from "../../helpers/clickOutside";
import UserMenu from "./userMenu";
import { useSelector } from "react-redux";

const Header = ({ page }) => {
  const [visible, setVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  const element = useRef(null);
  const userMenu = useRef(null);
  useClickOutside(element, () => {
    setShowAll(false);
  });
  useClickOutside(userMenu, () => {
    setShowUserMenu(false);
  });

  const color = "#65676b";

  return (
    <header>
      <div className="header_left">
        <Link to="/" className="header_logo">
          <div className="circle">
            <Logo />
          </div>
        </Link>
        <div className="search search1" onClick={() => setVisible(true)}>
          <Search color={color} />
          <input
            type="text"
            className="hide_input"
            placeholder="Search Facebook"
          />
        </div>
      </div>
      {visible && <SearchMenu color={color} setVisible={setVisible} />}
      <div className="header_middle">
        <Link
          to="/"
          className={`middle_icon ${page === "home" ? "active" : "hover1"}`}
        >
          {page === "home" ? <HomeActive /> : <Home />}
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Friends color={color} />
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Watch color={color} />
          <div className="middle_notification">9+</div>
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Market color={color} />
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Gaming color={color} />
        </Link>
      </div>
      <div className="header_right">
        {/* <Link to="profile" className="profile_link hover1">
          <img src={user?.user.picture} alt={user?.user.username} />
          <span>{user?.user.username}</span>
        </Link> */}
        <div
          ref={element}
          className={`circle_icon hover1 ${showAll && "active_header"}`}
        >
          <div
            onClick={() => {
              setShowAll((prev) => !prev);
            }}
          >
            <Menu />
          </div>
          {showAll && <AllMenu />}
        </div>
        <div className="circle_icon hover1">
          <Messenger />
        </div>
        <div className="circle_icon hover1">
          <Notifications />
          <span className="right_notification">5</span>
        </div>
        <div
          className={`circle_icon hover1 ${showUserMenu && "active_header"}`}
          ref={userMenu}
          style={{ border: page === "profile" ? "1rem #1876f2 solid" : "" }}
        >
          <div onClick={() => setShowUserMenu((prev) => !prev)}>
            <div className="profile hover1">
              <img src={user?.picture} alt={user?.username} />
            </div>
          </div>
          {showUserMenu && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
