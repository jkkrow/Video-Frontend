import { useRef, useContext } from "react";

import { UploadContext } from "context/upload-context";
import "./InitUpload.css";

const InitUpload = () => {
  const { initiateUpload } = useContext(UploadContext);
  const fileUploaderRef = useRef();

  const fileChangeHandler = (event) => {
    initiateUpload(event.target.files[0].name);
  };

  return (
    <div className="init-upload">
      <input
        ref={fileUploaderRef}
        hidden
        type="file"
        accept=".mp4"
        onChange={fileChangeHandler}
      />
    </div>
  );
};

export default InitUpload;
