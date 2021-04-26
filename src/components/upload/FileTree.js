import { useState } from "react";

import TreeNode from "./TreeNode";
import InitUpload from "./InitUpload";
import "./FileTree.css";

const FileTree = () => {
  const [root, setRoot] = useState(null);

  return (
    <div className="file-tree">
      {!root && <InitUpload onChange={setRoot} />}
      {root && <TreeNode node={root} />}
    </div>
  );
};

export default FileTree;
