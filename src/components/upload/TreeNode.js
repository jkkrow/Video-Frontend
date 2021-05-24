import { useState, useRef, useEffect, useContext } from "react";
// import axios from "axios";

import { ReactComponent as ArrowIcon } from "assets/icons/right-angle.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import IconButton from "../UI/IconButton";
import NewNode from "./NewNode";
import { UploadContext } from "context/upload-context";
import "./TreeNode.css";

const TreeNode = ({ currentFile, layer }) => {
  const { appendNext } = useContext(UploadContext);
  const [children, setChildren] = useState([]);
  const [optionTitle, setOptionTitle] = useState("");
  const [openChildren, setOpenChildren] = useState(false);
  const [addChild, setAddChild] = useState(false);
  const [expandBody, setExpandBody] = useState(true);
  const fileUploaderRef = useRef();

  useEffect(() => {
    // const uploadToAWS = async () => {
    //   const uploadConfig = await axios.get(
    //     `${process.env.REACT_APP_SERVER_URL}/upload`
    //   );
    //   await axios.put(uploadConfig.data.url, currentFile, {
    //     headers: { "Content-Type": currentFile.type },
    //     onUploadProgress: (progressEvent) => {
    //       console.log(progressEvent);
    //     },
    //   });
    // };
    // uploadToAWS();
  }, []);

  const displayChildrenHandler = () => setOpenChildren((prev) => !prev);

  const expandBodyHandler = () => setExpandBody((prev) => !prev);

  const addChildHandler = () => setAddChild(true);

  const inputChangeHandler = (event) => setOptionTitle(event.target.value);

  const openFileInputHandler = () => fileUploaderRef.current.click();

  const fileChangeHandler = async (event) => {
    if (!event.target.files?.length) return;

    // Add to state
    setChildren((prev) => [...prev, ...event.target.files]);

    // Add to entire tree
    const fileInfos = [...event.target.files].map((file) => ({
      name: file.name,
      optionTitle: "",
      layer: layer + 1,
    }));

    appendNext(fileInfos, { name: currentFile.name, layer: layer });

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
            {currentFile.name}
          </div>
          {children.length > 0 && (
            <IconButton
              className={`open-children${openChildren ? " rotated" : ""}`}
              onClick={displayChildrenHandler}
              Component={ArrowIcon}
            />
          )}
          <IconButton
            className="add-child"
            onClick={addChildHandler}
            Component={PlusIcon}
          />
        </div>

        <div className={`tree-node__expand${!expandBody ? " hide" : ""}`}>
          {layer > 1 && (
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

      {addChild && <NewNode onFile={openFileInputHandler} />}

      <div className={`tree-node__children${!openChildren ? " hide" : ""}`}>
        {children.length > 0 &&
          children.map((file) => (
            <TreeNode key={file.name} currentFile={file} layer={layer + 1} />
          ))}
      </div>
    </div>
  );
};

export default TreeNode;
