import { useRef } from "react";

import "./InitUpload.css";

const InitUpload = ({ onChange }) => {
  const fileUploaderRef = useRef();

  const openFileInputHandler = () => fileUploaderRef.current.click();

  const fileChangeHandler = (event) => {
    if (!event.target.files?.length) return;

    onChange(event.target.files[0]);
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
