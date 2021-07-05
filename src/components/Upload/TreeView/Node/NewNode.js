import React, { useEffect, useRef, useState } from "react";

import IconButton from "components/UI/IconButton";
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
          className={`upload${optionTitle.length === 0 ? " disabled" : ""}`}
          onClick={onFile}
          disabled={!optionTitle.length}
        />
      </form>
      <IconButton className="remove" onClick={removeHandler} />
    </div>
  );
};

export default NewNode;
