import "./header.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
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
  ArrowDown,
} from "../../svg/";

const Header = () => {
  const { user } = useSelector((user) => ({ ...user }));
  const { email, first_name, last_name, picture, username } = user?.users?.user;
  //   console.log(first_name, email, username);
  const color = "#65676b";
  return (
    <header>
      <div className="header_left">
        <Link to="/" className="header_logo">
          <div className="circle">
            <Logo />
          </div>
        </Link>
        <div className="search search1">
          <Search color={color} />
          <input
            type="text"
            className="hide_input"
            placeholder="Search Facebook"
          />
        </div>
      </div>
      <div className="header_middle">
        <Link to="/" className="middle_icon hover1 active">
          <HomeActive />
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
        <Link to="profile" className="profile_link hover1">
          <img src={picture} alt={username} />
          <span>{username}</span>
        </Link>
        <div className="circle_icon hover1">
          <Menu />
        </div>
        <div className="circle_icon hover1">
          <Messenger />
        </div>
        <div className="circle_icon hover1">
          <Notifications />
          <span className="right_notification">5</span>
        </div>
        <div className="circle_icon hover1">
          <ArrowDown />
        </div>
      </div>
    </header>
  );
};

export default Header;
