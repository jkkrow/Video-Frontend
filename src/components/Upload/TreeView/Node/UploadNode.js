import { useState } from "react";
import { useDispatch } from "react-redux";

import DragDrop from "components/FormElement/DragDrop";
import { ReactComponent as AngleRightIcon } from "assets/icons/angle-right.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import { ReactComponent as RemoveIcon } from "assets/icons/remove.svg";
import { appendChild, attachVideo, removeNode } from "store/actions/upload";
import "./UploadNode.css";

const UploadNode = ({ currentNode, treeId }) => {
  const dispatch = useDispatch();
  const [showChildren, setShowChildren] = useState(true);
  const [isExtended, setIsExtended] = useState(true);

  const addChildHandler = () => {
    dispatch(appendChild(currentNode.id));
  };

  const displayChildrenHandler = () => {
    setShowChildren((prev) => !prev);
  };

  const extendBodyHandler = () => {
    setIsExtended((prev) => !prev);
  };

  const removeNodeHandler = () => {
    dispatch(removeNode(currentNode.id));
  };

  const onFileHandler = (file) => {
    dispatch(attachVideo(file, currentNode.id, treeId));
  };

  return (
    <div className="upload-node">
      <div
        className="upload-node__body"
        style={{
          background: currentNode.layer % 2 === 0 ? "#242424" : "#424242",
        }}
      >
        {currentNode.info ? (
          <>
            <div className="upload-node__title" onClick={extendBodyHandler}>
              {currentNode.info.name}
            </div>
            {isExtended && (
              <div className="upload-node__extended">
                <div className="upload-node__progress">
                  <div className="upload-node__progress__bar">
                    <div className="upload-node__progress__bar--background" />
                    <div
                      className="upload-node__progress__bar--current"
                      style={{ width: currentNode.info.progress || "0%" }}
                    />
                  </div>
                  <div>{currentNode.info.progress}</div>

                  <div className="upload-node__progress__cancel">
                    <RemoveIcon />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <DragDrop type="video" onFile={onFileHandler} />
            {currentNode.id !== treeId && (
              <RemoveIcon
                style={{
                  top: "1.55rem",
                  left: "-4rem",
                  width: "2.4rem",
                  height: "2.4rem",
                }}
                onClick={removeNodeHandler}
              />
            )}
          </>
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
