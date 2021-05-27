import React, { useEffect, useRef, useState } from "react";

import { ReactComponent as UploadIcon } from "assets/icons/upload.svg";
import { ReactComponent as RemoveIcon } from "assets/icons/remove.svg";
import IconButton from "../../UI/IconButton";
import "./NewNode.css";

const NewNode = ({ onFile, onInput, onRemove }) => {
  const [optionTitle, setOptionTitle] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const inputChangeHandler = (event) => {
    setOptionTitle(event.target.value);
    onInput(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
  };

  const removeHandler = () => {
    onRemove(false);
  };

  return (
    <div className="new-node">
      <form onSubmit={submitHandler}>
        <input
          type="text"
          ref={inputRef}
          value={optionTitle}
          placeholder="Option Title"
          onChange={inputChangeHandler}
        />
        <IconButton
          className={`file-upload${
            optionTitle.length === 0 ? " disabled" : ""
          }`}
          onClick={onFile}
          disabled={!optionTitle.length}
          Component={UploadIcon}
        />
      </form>
      <IconButton
        className="remove"
        onClick={removeHandler}
        Component={RemoveIcon}
      />
    </div>
  );
};

export default NewNode;
