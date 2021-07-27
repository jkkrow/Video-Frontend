import Node from "../Node/UploadNode";
import "./UploadTree.css";

const UploadTree = ({ tree }) => {
  return (
    <div className="upload-tree">
      <Node currentNode={tree.root} />
    </div>
  );
};

export default UploadTree;
