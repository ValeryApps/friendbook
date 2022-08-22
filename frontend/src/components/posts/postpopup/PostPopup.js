import { useRef, useState } from "react";
import "./postpopup.css";

import EmojiPickerBackground from "./EmojiPickerBackground";
import AddToYourPost from "./AddToYourPost";
import ImagePreview from "./ImagePreview";
import { useClickOutside } from "../../../helpers/clickOutside";
import { createPost } from "../../../functions/post";
import { PulseLoader } from "react-spinners";
import dataURItoBlob from "../../../helpers/dataURItoBlob";
import { uploadImages } from "../../../helpers/uploadImages";
import Error from "../../Error";

const PostPopup = ({ user, setVisible }) => {
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [images, setImages] = useState([]);
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const popup = useRef(null);
  useClickOutside(popup, () => {
    setVisible(false);
  });
  const post = async () => {
    setLoading(true);

    let res = "";
    if (background) {
      res = await createPost(user?.id, user.token, text, background);
    } else if (images && images.length) {
      const postImages = images.map((image) => dataURItoBlob(image));
      const path = `${user.username}/posts`;
      let formData = new FormData();
      formData.append("path", path);
      postImages.forEach((img) => {
        formData.append("file", img);
      });
      const response = await uploadImages(formData, path, user.token);
      res = await createPost(user.id, user.token, text, null, response, null);
    } else if (text) {
      res = await createPost(user?.id, user.token, text, null);
    } else {
    }
    setLoading(false);
    if (res === "ok") {
      setText("");
      setBackground("");
      setVisible(false);
      setImages("");
    } else {
      setError(res);
    }
    return res;
  };
  return (
    <div className="blur">
      <div className="post_box" ref={popup}>
        {error && (
          <div className="error_box">
            <Error error={error} setError={setError} />
          </div>
        )}
        <div className="post_header">
          <div className="small_circle" onClick={() => setVisible(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>
        <div className="box_profile">
          <img src={user?.picture} alt="" className="box_profile_image" />
          <div className="box_col">
            <div className="box_profile_name">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="box_privacy">
              <img src="../../../icons/public.png" alt="" />
              <span>Public</span>
              <i className="arrowDown_icon"></i>
            </div>
          </div>
        </div>
        {!showPrev ? (
          <>
            <EmojiPickerBackground
              text={text}
              setText={setText}
              user={user}
              type2={false}
              setBackground={setBackground}
              background={background}
            />
          </>
        ) : (
          <ImagePreview
            user={user}
            text={text}
            setText={setText}
            images={images}
            setImages={setImages}
            setShowPrev={setShowPrev}
            setError={setError}
          />
        )}
        <AddToYourPost setShowPrev={setShowPrev} />
        <button disabled={loading} className="post_submit" onClick={post}>
          {loading ? "Posting" : "Post"}
          {loading && (
            <PulseLoader color="white" size={3} style={{ marginTop: "3px" }} />
          )}
        </button>
      </div>
    </div>
  );
};

export default PostPopup;
