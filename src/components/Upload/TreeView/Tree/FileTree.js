import { useState } from "react";

import TreeNode from "../Node/TreeNode";
import InitUpload from "../Node/InitUpload";
import "./FileTree.css";

const FileTree = () => {
  const [root, setRoot] = useState(null);

  return (
    <div className="file-tree">
      {!root && <InitUpload onChange={setRoot} />}
      {root && <TreeNode currentNode={root} />}
    </div>
  );
};

export default FileTree;
