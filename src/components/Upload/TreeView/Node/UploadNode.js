import { useState } from "react";
import { useDispatch } from "react-redux";

import DragDrop from "components/FormElement/DragDrop";
import { ReactComponent as AngleRightIcon } from "assets/icons/angle-right.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import { appendChild, attachVideo } from "store/actions/upload";
import "./UploadNode.css";

const UploadNode = ({ currentNode, treeId }) => {
  const dispatch = useDispatch();
  const [showChildren, setShowChildren] = useState(true);

  const addChildHandler = () => {
    dispatch(appendChild(currentNode.id));
  };

  const displayChildrenHandler = () => {
    setShowChildren((prev) => !prev);
  };

  const onFileHandler = (file) => {
    dispatch(attachVideo(file, currentNode.id, treeId));
  };

  return (
    <div className="upload-node">
      <div className="upload-node__body">
        {currentNode.info ? (
          <div className="upload-node__title">{currentNode.info.name}</div>
        ) : (
          <DragDrop type="video" onFile={onFileHandler} />
        )}
        {currentNode.children.length > 0 && (
          <AngleRightIcon
            style={{ top: "2rem", left: "2rem" }}
            className={showChildren ? " rotated" : ""}
            onClick={displayChildrenHandler}
          />
        )}
        {currentNode.children.length < 4 && (
          <PlusIcon
            style={{ top: "2rem", right: "2rem" }}
            onClick={addChildHandler}
          />
        )}
      </div>
      <div className={`upload-node__children${!showChildren ? " hide" : ""}`}>
        {currentNode.children.map((item) => (
          <UploadNode key={item.id} currentNode={item} treeId={treeId} />
        ))}
      </div>
    </div>
  );
};

export default UploadNode;
