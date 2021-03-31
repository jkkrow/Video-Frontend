import React, { useState, useRef, useContext } from "react";

import VideoPlayer from "../../components/video/VideoPlayer";
import AppendNext from "./AppendNext";
import { UploadContext } from "../../context/upload-context";
import "./FileUploader.css";

const FileUploader = ({ from }) => {
  const { initPart, addPart } = useContext(UploadContext);
  const [part, setPart] = useState();
  const [source, setSource] = useState();
  const fileUploaderRef = useRef();

  const onFileChangeHandler = (event) => {
    if (!event.target.files?.length) return;

    const currentPart = {
      file: event.target.files[0].name,
      next: [],
    };

    // Add part to state
    setPart(currentPart);

    // Add to entire upload state
    from ? addPart(currentPart, from) : initPart(currentPart);

    // Read file to show preview
    const reader = new FileReader();
    reader.onload = (e) => setSource(e.target.result);
    reader.readAsDataURL(event.target.files[0]);
  };

  return (
    <div className="file-uploader">
      <input
        ref={fileUploaderRef}
        type="file"
        hidden
        accept=".mp4"
        onChange={onFileChangeHandler}
      />

      <div
        className="file-uploader__button"
        onClick={() => fileUploaderRef.current.click()}
      >
        Upload
      </div>

      {source && (
        <div>
          <VideoPlayer
            src={source}
            autoPlay={false}
            style={{ width: "30rem" }}
          />
          <AppendNext from={part} />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
