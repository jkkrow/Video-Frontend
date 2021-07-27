import { useState } from "react";

import { ReactComponent as PreviewIcon } from "assets/icons/play.svg";
import { ReactComponent as RemoveIcon } from "assets/icons/remove.svg";
import VideoTree from "components/Video/Tree/VideoTree";
import "./Preview.css";

const Preview = ({ tree }) => {
  const [activePreview, setActivePreview] = useState(false);

  const togglePreviewHandler = () => {
    setActivePreview((prev) => !prev);
  };

  return (
    <div className={`preview${activePreview ? " active" : ""}`}>
      <div className="preview__toggle" onClick={togglePreviewHandler}>
        <PreviewIcon className={!activePreview ? " active" : ""} />
        <RemoveIcon className={activePreview ? " active" : ""} />
      </div>

      <div className="preview__background" />

      <div className="preview__video__container">
        <div className="preview__video">
          <VideoTree tree={tree} autoPlay={false} editMode={true} />
        </div>
      </div>
    </div>
  );
};

export default Preview;
