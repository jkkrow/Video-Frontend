import { useContext, useEffect, useState } from "react";

import { ReactComponent as PreviewIcon } from "assets/icons/play.svg";
import { ReactComponent as RemoveIcon } from "assets/icons/remove.svg";
import VideoPlayer from "components/Video/VideoPlayer";
import { UploadContext } from "context/upload-context";
import "./Preview.css";

const Preview = () => {
  const { videoTree } = useContext(UploadContext);
  const [currentVideo, setCurrentVideo] = useState();
  const [nextVideos, setNextVideos] = useState([]);
  const [activePreview, setActivePreview] = useState(false);

  useEffect(() => {
    if (!videoTree.root) return;

    setCurrentVideo(videoTree.root.info.url);
    setNextVideos(videoTree.root.children);
  }, [videoTree]);

  const togglePreviewHandler = () => {
    setActivePreview((prev) => !prev);
  };

  return (
    <div className="preview">
      {videoTree.root && (
        <>
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
              className={`toggle-button${!activePreview ? " active" : ""}`}
            />
            <RemoveIcon
              className={`toggle-button${activePreview ? " active" : ""}`}
            />
          </label>

          <div className="preview__background" />
        </>
      )}

      {currentVideo && (
        <div className={`preview__video${activePreview ? " active" : ""}`}>
          <VideoPlayer src={currentVideo} autoPlay={false} next={nextVideos} />
        </div>
      )}
    </div>
  );
};

export default Preview;
