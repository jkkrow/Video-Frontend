import { useContext, useState } from "react";

import { ReactComponent as PreviewIcon } from "assets/icons/play.svg";
import { ReactComponent as RemoveIcon } from "assets/icons/remove.svg";
import VideoPlayer from "components/Video/VideoPlayer";
import { UploadContext } from "context/upload-context";
import "./Preview.css";

const Preview = () => {
  const videoTree = JSON.parse(useContext(UploadContext).videoTree);
  const [currentVideo, setCurrentVideo] = useState();
  const [nextVideos, setNextVideos] = useState([]);
  const [activePreview, setActivePreview] = useState(false);

  const togglePreviewHandler = () => setActivePreview((prev) => !prev);

  return (
    <div className="preview">
      <input
        type="checkbox"
        className="preview__checkbox"
        id="toggle-preview"
      />

      <label
        className="preview__toggle"
        htmlFor="toggle-preview"
        onClick={togglePreviewHandler}
      >
        <PreviewIcon
          className={`toggle-button${!activePreview ? "--active" : ""}`}
        />
        <RemoveIcon
          className={`toggle-button${activePreview ? "--active" : ""}`}
        />
      </label>

      <div className="preview__background"></div>

      <div className="preview__video"></div>
    </div>
  );
};

export default Preview;
