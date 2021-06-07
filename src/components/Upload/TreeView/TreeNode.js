import { useState, useRef, useEffect, useContext } from "react";
// import axios from "axios";

import { ReactComponent as ArrowIcon } from "assets/icons/right-angle.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import IconButton from "../../UI/IconButton";
import NewNode from "./NewNode";
import { UploadContext } from "context/upload-context";
import "./TreeNode.css";

const TreeNode = ({ currentNode }) => {
  const { appendNext } = useContext(UploadContext);
  const [children, setChildren] = useState([]);
  const [openChildren, setOpenChildren] = useState(false);
  const [addChild, setAddChild] = useState(false);
  const [childInput, setChildInput] = useState("");
  const [expandBody, setExpandBody] = useState(true);
  const [optionTitle, setOptionTitle] = useState(currentNode.optionTitle);
  const fileUploaderRef = useRef();

  useEffect(() => {
    // const uploadToAWS = async () => {
    //   const uploadConfig = await axios.get(
    //     `${process.env.REACT_APP_SERVER_URL}/upload`
    //   );
    //   await axios.put(uploadConfig.data.url, currentNode.file, {
    //     headers: { "Content-Type": currentNode.file.type },
    //     onUploadProgress: (progressEvent) => {
    //       console.log(progressEvent);
    //     },
    //   });
    // };
    // uploadToAWS();
  }, []);

  const displayChildrenHandler = () => {
    setOpenChildren((prev) => !prev);
  };

  const expandBodyHandler = () => {
    setExpandBody((prev) => !prev);
  };

  const addChildHandler = () => {
    setAddChild(true);
  };

  const inputChangeHandler = (event) => {
    setOptionTitle(event.target.value);
  };

  const openFileInputHandler = () => {
    fileUploaderRef.current.click();
  };

  const fileChangeHandler = async (event) => {
    if (!event.target.files?.length) return;

    // Add to state
    const fileObject = {
      file: event.target.files[0],
      optionTitle: childInput,
      layer: currentNode.layer + 1,
    };

    setChildren((prev) => [...prev, fileObject]);

    // Add to entire tree
    const fileInfo = {
      name: event.target.files[0].name,
      optionTitle: childInput,
      layer: currentNode.layer + 1,
      src: URL.createObjectURL(event.target.files[0]),
    };

    appendNext(fileInfo, currentNode);

    // Close new node
    setAddChild(false);

    // Open children nodes
    setOpenChildren(true);
  };

  return (
    <div className="tree-node">
      <div className="tree-node__body">
        <div className="tree-node__header">
          <input
            ref={fileUploaderRef}
            hidden
            multiple
            type="file"
            accept=".mp4"
            onChange={fileChangeHandler}
          />
          <div className="tree-node__title" onClick={expandBodyHandler}>
            {currentNode.file.name}
          </div>
          {children.length > 0 && (
            <IconButton
              className={`open-children${openChildren ? " rotated" : ""}`}
              onClick={displayChildrenHandler}
              Component={ArrowIcon}
            />
          )}
          {children.length < 4 && (
            <IconButton
              className="add-child"
              onClick={addChildHandler}
              Component={PlusIcon}
            />
          )}
        </div>

        <div className={`tree-node__expand${!expandBody ? " hide" : ""}`}>
          {currentNode.layer > 0 && (
            <input
              type="text"
              placeholder="Option Title"
              value={optionTitle}
              onChange={inputChangeHandler}
            />
          )}
          <div className="tree-node__progress"></div>
        </div>
      </div>

      {addChild && (
        <NewNode
          onFile={openFileInputHandler}
          onInput={setChildInput}
          onRemove={setAddChild}
        />
      )}

      {children.length > 0 && (
        <div className={`tree-node__children${!openChildren ? " hide" : ""}`}>
          {children.map((item) => (
            <TreeNode key={item.optionTitle} currentNode={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
