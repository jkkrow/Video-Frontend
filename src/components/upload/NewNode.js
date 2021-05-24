import { useState } from "react";

import { ReactComponent as UploadIcon } from "assets/icons/upload.svg";
import IconButton from "../UI/IconButton";
import "./NewNode.css";

const NewNode = ({ onFile }) => {
  const [optionTitle, setOptionTitle] = useState("");

  const inputChangeHandler = (event) => setOptionTitle(event.target.value);

  return (
    <div className="new-node">
      <input
        type="text"
        placeholder="Option Title"
        value={optionTitle}
        onChange={inputChangeHandler}
      />
      <IconButton
        className={`file-upload${optionTitle.length === 0 ? " disabled" : ""}`}
        onClick={onFile}
        disabled={!optionTitle.length}
        Component={UploadIcon}
      />
    </div>
  );
};

export default NewNode;
