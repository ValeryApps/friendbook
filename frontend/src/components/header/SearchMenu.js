import React, { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../../helpers/clickOutside";
import { Return, Search } from "../../svg";

const SearchMenu = ({ color, setVisible }) => {
  const [iconVisible, setIconVisible] = useState(true);
  const el = useRef(null);
  const input = useRef(null);
  useClickOutside(el, () => {
    setVisible(false);
  });
  useEffect(() => {
    input.current.focus();
  }, []);
  return (
    <div className="header_left search_area scrollbar" ref={el}>
      <div className="search_wrap">
        <div className="header_logo">
          <div className="circle hover1" onClick={() => setVisible(false)}>
            <Return color={color} />
          </div>
        </div>
        <div className="search" onClick={() => input.curren.focus()}>
          {iconVisible && (
            <div>
              <Search color={color} />
            </div>
          )}
          <input
            type="text"
            placeholder="Search Facebook"
            ref={input}
            onFocus={() => setIconVisible(false)}
            onBlur={() => setIconVisible(true)}
          />
        </div>
      </div>
      <div className="search_history_header">
        <span>Recent searches</span>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>Edit</a>
      </div>
      <div className="search_history"></div>
      <div className="search_results scrollbar"></div>
    </div>
  );
};

export default SearchMenu;
