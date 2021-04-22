import { useState, useRef, useContext } from "react";

import { ReactComponent as Plus } from "assets/icons/plus.svg";
import VideoPlayer from "components/Video/VideoPlayer";
import AppendNext from "./AddFile";
import { UploadContext } from "context/upload-context";
// import axios from "axios";
import "./FileUploader.css";

const FileUploader = ({ from }) => {
  const { appendNext } = useContext(UploadContext);
  const [part, setPart] = useState();
  const [source, setSource] = useState();
  const [children, setChildren] = useState([]);
  const fileUploaderRef = useRef();

  const openFileInputHandler = () => fileUploaderRef.current.click();

  const appendChildHandler = () =>
    setChildren((prev) => (prev.length === 6 ? prev : [...prev, ""]));

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
      <div className="file-uploader__header">
        <input
          ref={fileUploaderRef}
          hidden
          type="file"
          accept=".mp4"
          onChange={onFileChangeHandler}
        />
        <div className="file-uploader_title" onClick={openFileInputHandler}>
          {!part ? "Add File" : part}
        </div>
        <div className="file-uploader__progress"></div>
        {part && <Plus onClick={appendChildHandler} />}
      </div>
      <div className="file-uploader__children">
        {children.map((child) => (
          <FileUploader />
        ))}
      </div>
      {/* {source && <AppendNext from={part} />} */}
    </div>
  );
};

export default FileUploader;
