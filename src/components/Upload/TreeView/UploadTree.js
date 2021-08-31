import UploadNode from "./UploadNode";
import "./UploadTree.css";

const UploadTree = ({ tree }) => {
  return (
    <div className="upload-tree">
      <UploadNode currentNode={tree.root} treeId={tree.root.id} />
    </div>
  );
};

export default UploadTree;
