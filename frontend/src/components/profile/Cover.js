const Cover = ({ cover, menuShown, setMenuShown, coverRef }) => {
  // const [menuShown, setMenuShown] = useState(false);
  //   console.log("I am profile cover");
  return (
    <div className="profile_cover">
      {cover && <img src={cover} alt="" className="cover" />}
      <div className="update_cover_wrapper" ref={coverRef}>
        <div
          className="open_cover_update"
          onClick={() => setMenuShown((prev) => !prev)}
        >
          <i className="camera_filled_icon"></i>
          Add Cover Photo
        </div>
        {menuShown && (
          <div className="open_cover_menu">
            <div className="open_cover_menu_item">
              <i className="photo_icon"></i>
              Select Photo
            </div>
            <div className="open_cover_menu_item">
              <i className="upload_icon"></i>
              Upload photo
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cover;
