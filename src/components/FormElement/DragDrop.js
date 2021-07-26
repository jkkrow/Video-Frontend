import { useState, useCallback } from "react";

import { ReactComponent as UploadIcon } from "assets/icons/upload.svg";
import "./DragDrop.css";

const DragDrop = ({ type, onFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isError, setIsError] = useState(false);

  const fileChangeHandler = useCallback(
    (e) => {
      setIsError(false);

      let selectedFile;

      if (e.type === "drop") {
        selectedFile = e.dataTransfer.files[0];
      } else {
        selectedFile = e.target.files[0];
      }

      console.log(selectedFile.type);

      if (type && selectedFile.type.split("/")[0] !== type) {
        return setIsError(true);
      }

      onFile(selectedFile);
    },
    [type, onFile]
  );

  const dragInHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const dragOutHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  }, []);

  const dragOverHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files) {
      setIsDragging(true);
    }
  }, []);

  const dropHandler = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      fileChangeHandler(e);
      setIsDragging(false);
    },
    [fileChangeHandler]
  );

  return (
    <div
      className={`drag-drop${isDragging ? " dragging" : ""}${
        isError ? " invalid" : ""
      }`}
      onDragEnter={dragInHandler}
      onDragLeave={dragOutHandler}
      onDragOver={dragOverHandler}
      onDrop={dropHandler}
    >
      <label>
        <input type="file" hidden onChange={fileChangeHandler} />
        <UploadIcon />
      </label>
      <p>Drag and Drop Video File</p>
    </div>
  );
};

export default DragDrop;
