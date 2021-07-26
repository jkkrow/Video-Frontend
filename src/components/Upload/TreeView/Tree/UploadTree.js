import { useSelector } from "react-redux";

import Node from "../Node/UploadNode";
// import TreeNode from "../Node/TreeNode";
// import InitUpload from "../Node/InitUpload";
import "./UploadTree.css";

const UploadTree = () => {
  const { uploadTree } = useSelector((state) => state.upload);

  return (
    <div className="upload-tree">
      {uploadTree.root && <Node currentNode={uploadTree.root} />}
      {/* {!root && <InitUpload onChange={setRoot} />}
      {root && <TreeNode currentNode={root} />} */}
    </div>
  );
};

export default UploadTree;
