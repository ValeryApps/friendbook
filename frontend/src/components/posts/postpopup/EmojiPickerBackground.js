import { useState, useRef, useEffect } from "react";
import Picker from "emoji-picker-react";

const EmojiPickerBackground = ({
  text,
  setText,
  user,
  setBackground,
  background,
  type2 = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showBg, setShowBg] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(3);
  const textRef = useRef(null);
  const bgRef = useRef(null);
  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);
  const handleEmoji = (e, { emoji }) => {
    const ref = textRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    setCursorPosition(start.length + emoji.length);
  };

  const postBackgrounds = [
    "../../../images/postBackgrounds/1.jpg",
    "../../../images/postBackgrounds/2.jpg",
    "../../../images/postBackgrounds/3.jpg",
    "../../../images/postBackgrounds/4.jpg",
    "../../../images/postBackgrounds/5.jpg",
    "../../../images/postBackgrounds/6.jpg",
    "../../../images/postBackgrounds/7.jpg",
    "../../../images/postBackgrounds/8.jpg",
    "../../../images/postBackgrounds/9.jpg",
  ];
  const handleDisplayBackground = (index) => {
    bgRef.current.style.backgroundImage = `url(${postBackgrounds[index]})`;
    setBackground(postBackgrounds[index]);
    bgRef.current.classList.add("bgHandler");
  };
  const removeBackground = () => {
    bgRef.current.style.backgroundImage = "";
    setBackground("");
    bgRef.current.classList.remove("bgHandler");
  };

  return (
    <div className={`${type2 ? "images_input" : ""}`}>
      <div className={`${!type2 ? "flex_center" : ""}`} ref={bgRef}>
        <textarea
          ref={textRef}
          maxLength={250}
          value={text}
          className={`post_input ${type2 && "input2"}`}
          placeholder={`What is on your mind ${user?.first_name}
    `}
          style={{
            paddingTop: `${
              background
                ? Math.abs(textRef.current?.value.length * 0.1 - 24)
                : 0
            }%`,
          }}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
      <div className={`${!type2 ? "post_emojis_wrap" : ""}`}>
        {showPicker && (
          <div
            className={`comment_emoji_picker ${
              type2 ? "movePicker2" : "remove"
            }`}
          >
            <Picker onEmojiClick={handleEmoji} />
          </div>
        )}
        {!type2 && (
          <>
            {" "}
            <img
              className="colorful"
              src="../../../icons/colorful.png"
              alt=""
              onClick={() => setShowBg((prev) => !prev)}
            />
            {showBg && (
              <div className="post_background">
                <div className="no_bg" onClick={removeBackground}></div>
                {postBackgrounds.map((image, i) => (
                  <img
                    src={image}
                    key={i}
                    alt=""
                    onClick={() => handleDisplayBackground(i)}
                  />
                ))}
              </div>
            )}
          </>
        )}
        <i
          className={`emoji_icon_large ${type2 ? "moveLeft" : ""}`}
          onClick={() => setShowPicker((prev) => !prev)}
        ></i>
      </div>
    </div>
  );
};

export default EmojiPickerBackground;
