import { useContext } from "react";

import TreeNode from "./TreeNode";
import InitUpload from "./InitUpload";
import { UploadContext } from "context/upload-context";
import "./FileTree.css";

const FileTree = () => {
  const { videoTree } = useContext(UploadContext);

  return (
    <div className="file-tree">
      {!videoTree.root.name && <InitUpload />}
      {videoTree.root.name && <TreeNode node={videoTree.root} />}
    </div>
  );
};

export default FileTree;
