import { useRef } from "react";
import MenuItem from "./MenuItem";
import { useClickOutside } from "../../helpers/clickOutside";

export default function PostMenu({
  postUserId,
  userId,
  imagesLength,
  setShowMenu,
  itIsMe,
}) {
  const menu = useRef(null);
  useClickOutside(menu, () => setShowMenu(false));
  const test = postUserId === userId;

  return (
    <ul className="post_menu" ref={menu}>
      {postUserId === userId && <MenuItem icon="pin_icon" title="Pin Post" />}
      <MenuItem
        icon="save_icon"
        title="Save Post"
        subtitle="Add this to your saved items."
      />
      <div className="line"></div>
      {test && itIsMe && <MenuItem icon="edit_icon" title="Edit Post" />}
      {!test && (
        <MenuItem
          icon="turnOnNotification_icon"
          title="Turn on notifications for this post"
        />
      )}
      {imagesLength && <MenuItem icon="download_icon" title="Download" />}
      {imagesLength && (
        <MenuItem icon="fullscreen_icon" title="Enter Fullscreen" />
      )}
      {test && itIsMe && (
        <MenuItem img="../../../icons/lock.png" title="Edit audience" />
      )}
      {test && itIsMe && (
        <MenuItem
          icon="turnOffNotifications_icon"
          title="Turn off notifications for this post"
        />
      )}
      {test && itIsMe && (
        <MenuItem icon="delete_icon" title="Turn off translations" />
      )}
      {test && itIsMe && <MenuItem icon="date_icon" title="Edit Date" />}
      {test && itIsMe && (
        <MenuItem icon="refresh_icon" title="Refresh share attachment" />
      )}
      {test && itIsMe && (
        <MenuItem icon="archive_icon" title="Move to archive" />
      )}
      {test && itIsMe && (
        <MenuItem
          icon="trash_icon"
          title="Move to trash"
          subtitle="items in your trash are deleted after 30 days"
        />
      )}
      {!test && <div className="line"></div>}
      {!test && (
        <MenuItem
          img="../../../icons/report.png"
          title="Report post"
          subtitle="i'm concerned about this post"
        />
      )}
    </ul>
  );
}
