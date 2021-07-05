import { useRef, useContext } from "react";
import { UploadContext } from "context/upload-context";

import "./InitUpload.css";

const InitUpload = ({ onChange }) => {
  const { initiateUpload } = useContext(UploadContext);
  const fileUploaderRef = useRef();

  const openFileInputHandler = () => {
    fileUploaderRef.current.click();
  };

  const fileChangeHandler = (event) => {
    if (!event.target.files?.length) return;

    onChange({
      file: event.target.files[0],
      layer: 0,
    });

    initiateUpload({
      name: event.target.files[0].name,
      layer: 0,
      src: URL.createObjectURL(event.target.files[0]),
    });
  };

  return (
    <div className="init-upload" onClick={openFileInputHandler}>
      <input
        ref={fileUploaderRef}
        hidden
        type="file"
        accept=".mp4"
        onChange={fileChangeHandler}
      />
      <div>Start Upload</div>
    </div>
  );
};

export default InitUpload;
