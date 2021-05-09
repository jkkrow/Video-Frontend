import { useState, useRef, useEffect } from "react";
// import axios from "axios";

import { ReactComponent as ChildrenOpener } from "assets/icons/right-angle.svg";
import { ReactComponent as ChildrenAdder } from "assets/icons/plus.svg";
import "./TreeNode.css";

const TreeNode = ({ node }) => {
  const [openChildren, setOpenChildren] = useState(false);
  const [children, setChildren] = useState([]);
  const fileUploaderRef = useRef();

  useEffect(() => {
    // const uploadToAWS = async () => {
    //   const uploadConfig = await axios.get(
    //     `${process.env.REACT_APP_SERVER_URL}/upload`
    //   );
    //   await axios.put(uploadConfig.data.url, node.file, {
    //     headers: { "Content-Type": node.file.type },
    //     onUploadProgress: (progressEvent) => {
    //       console.log(progressEvent);
    //     },
    //   });
    // };
    // uploadToAWS();
  }, []);

  const displayChildrenHandler = () => setOpenChildren((prev) => !prev);

  const openFileInputHandler = () => fileUploaderRef.current.click();

  const fileChangeHandler = async (event) => {
    if (!event.target.files?.length) return;

    // Filter duplicated files and Add to state
    setChildren((prev) => {
      const filterSet = new Set();
      const files = [...prev, ...event.target.files];

      return files.filter((item) => {
        const duplicate = filterSet.has(item.name);
        filterSet.add(item.name);
        return !duplicate;
      });
    });

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
          <div>{node.name}</div>
          <div className="tree-node__progress"></div>
        </div>
        {children.length > 0 && (
          <button
            className={`tree-node__open-children${
              openChildren ? " rotated" : ""
            }`}
            onClick={displayChildrenHandler}
          >
            <ChildrenOpener />
          </button>
        )}
        <button
          className="tree-node__add-children"
          onClick={openFileInputHandler}
        >
          <ChildrenAdder />
        </button>
      </div>

      <div className={`tree-node__children${!openChildren ? " hide" : ""}`}>
        {children.length > 0 &&
          children.map((file) => <TreeNode key={file.name} node={file} />)}
      </div>
    </div>
  );
};

export default TreeNode;
