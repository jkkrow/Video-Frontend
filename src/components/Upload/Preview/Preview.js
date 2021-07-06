import { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import { ReactComponent as PreviewIcon } from "assets/icons/play.svg";
import { ReactComponent as RemoveIcon } from "assets/icons/remove.svg";
import VideoTree from "components/Video/Tree/VideoTree";
import { UploadContext } from "context/upload-context";
import "./Preview.css";

const Preview = () => {
  const { videoTree } = useContext(UploadContext);

  const [activePreview, setActivePreview] = useState(false);

  const isBigScreen = useMediaQuery({ query: "(min-width: 1000px)" });

  const togglePreviewHandler = () => {
    setActivePreview((prev) => !prev);
  };

  useEffect(() => {
    setActivePreview(false);
  }, [isBigScreen]);

  return (
    <>
      {isBigScreen && (
        <div className="preview--big-screen">
          <VideoTree tree={videoTree} autoPlay={false} editMode={true} />
        </div>
      )}

      {!isBigScreen && videoTree.root && (
        <div className="preview--small-screen">
          <input
            className="preview__checkbox"
            type="checkbox"
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

          <div className="preview__video__container">
            <div className={`preview__video${activePreview ? " active" : ""}`}>
              <VideoTree tree={videoTree} autoPlay={false} editMode={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Preview;
