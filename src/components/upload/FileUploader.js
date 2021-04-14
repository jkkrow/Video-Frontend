import React, { useState, useRef, useContext } from "react";

import { ReactComponent as Change } from "assets/icons/change.svg";
import { ReactComponent as Remove } from "assets/icons/remove.svg";
import VideoPlayer from "components/video/VideoPlayer";
import AppendNext from "./AppendNext";
import { UploadContext } from "context/upload-context";
// import axios from "axios";
import "./FileUploader.css";

const FileUploader = ({ from }) => {
  const { appendNext } = useContext(UploadContext);
  const [part, setPart] = useState();
  const [source, setSource] = useState();
  const fileUploaderRef = useRef();

  const onFileChangeHandler = async (event) => {
    if (!event.target.files?.length) return;

    const file = event.target.files[0];

    // Add part to state
    setPart(file.name);

    // Add to entire upload state
    appendNext(file.name, from);

    // Read file to show preview
    setSource(URL.createObjectURL(file));

    // Upload file to AWS S3
    // const uploadConfig = await axios.get(
    //   `${process.env.REACT_APP_SERVER_URL}/upload`
    // );

    // await axios.put(uploadConfig.data.url, file, {
    //   headers: { "Content-Type": file.type },
    //   onUploadProgress: (progressEvent) => {
    //     console.log(progressEvent);
    //   },
    // });
  };

  return (
    <div className="file-uploader">
      <div
        className="file-uploader__dnd"
        onClick={() => (!source ? fileUploaderRef.current.click() : null)}
      >
        <input
          ref={fileUploaderRef}
          type="file"
          hidden
          accept=".mp4"
          onChange={onFileChangeHandler}
        />
        {source && <VideoPlayer src={source} autoPlay={false} />}
        {source && (
          <div className="file-uploader__progress">
            <Change onClick={() => fileUploaderRef.current.click()} />
            <Remove />
          </div>
        )}
      </div>
      {source && <AppendNext from={part} />}
    </div>
  );
};

export default FileUploader;
