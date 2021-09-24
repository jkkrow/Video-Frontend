import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DragDrop from "components/FormElement/DragDrop";
import Modal from "components/UI/Modal";
import Tooltip from "components/UI/Tooltip";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import { ReactComponent as RemoveIcon } from "assets/icons/remove.svg";
import { ReactComponent as AngleLeftIcon } from "assets/icons/angle-left.svg";
import { ReactComponent as DoubleAngleLeftIcon } from "assets/icons/double-angle-left.svg";
import {
  appendChild,
  attachVideo,
  updateActiveNode,
  updateNode,
  removeNode,
} from "store/actions/upload";
import { validateTree } from "util/tree";
import "./UploadNode.css";

const UploadNode = ({ currentNode, previousNode, treeId }) => {
  const dispatch = useDispatch();

  const { activeId } = useSelector((state) => state.upload);
  const { accessToken } = useSelector((state) => state.auth);

  const [displayModal, setDisplayModal] = useState(false);

  const activeNodeHandler = (id) => {
    dispatch(updateActiveNode(id));
  };

  const addChildHandler = () => {
    dispatch(appendChild(currentNode.id));
  };

  const removeNodeHandler = () => {
    if (!displayModal) {
      const isNotEmpty = validateTree(currentNode, "info", null, false);

      if (isNotEmpty) return setDisplayModal(true);
    }

    dispatch(removeNode(currentNode.id));

    if (currentNode.id === activeId) {
      dispatch(updateActiveNode(previousNode.id));
    }
  };

  const closeWarningHandler = () => {
    setDisplayModal(false);
  };

  const onFileHandler = (file) => {
    dispatch(attachVideo(file, currentNode.id, treeId, accessToken));
  };

  const labelChangeHandler = (event) => {
    dispatch(updateNode({ label: event.target.value }, currentNode.id));
  };

  return (
    <div
      className={`upload-node${currentNode.id === activeId ? " active" : ""}`}
    >
      <Modal
        on={displayModal}
        header="Remove Video"
        content="This will remove all videos appended to it. Are you sure to proceed?"
        footer="REMOVE"
        onConfirm={removeNodeHandler}
        onClose={closeWarningHandler}
      />
      {(currentNode.id === activeId || previousNode?.id === activeId) && (
        <div
          className="upload-node__body"
          style={{
            backgroundColor:
              currentNode.layer % 2 === 0 ? "#242424" : "#424242",
          }}
        >
          {currentNode.info ? (
            <div className="upload-node__content">
              <div
                className={`upload-node__title${
                  currentNode.id === activeId ? " parent" : ""
                }`}
                onClick={() =>
                  currentNode.id !== activeId &&
                  activeNodeHandler(currentNode.id)
                }
              >
                {currentNode.info.name}
              </div>
              <div className="upload-node__inputs">
                {currentNode.id !== treeId && (
                  <label>
                    Label
                    <input
                      type="text"
                      value={currentNode.info.label}
                      onChange={labelChangeHandler}
                    />
                  </label>
                )}
                <div className="upload-node__timeline">
                  Timeline
                  <input
                    type="number"
                    readOnly
                    value={currentNode.info.timelineStart || 0}
                  />
                  to
                  <input
                    type="number"
                    readOnly
                    value={currentNode.info.timelineEnd || 0}
                  />
                  <p>Mark timeline with a button below Video Player.</p>
                </div>
              </div>
              <div className="upload-node__action">
                <div className="upload-node__progress">
                  {currentNode.info.progress || "0%"}
                </div>
              </div>
            </div>
          ) : (
            <DragDrop type="video" onFile={onFileHandler} />
          )}
          {currentNode.id !== treeId && (
            <RemoveIcon
              style={{
                top: "2rem",
                left: "-4rem",
                width: "2.4rem",
                height: "2.4rem",
              }}
              onClick={removeNodeHandler}
            />
          )}
          {currentNode.children.length < 4 && currentNode.id === activeId && (
            <Tooltip
              style={{ position: "absolute", top: "2.5rem", right: "2rem" }}
              text="Append next video"
              direction="top"
            >
              <PlusIcon onClick={addChildHandler} style={{ width: "100%" }} />
            </Tooltip>
          )}
          {currentNode.id === treeId && currentNode.info && (
            <Tooltip
              style={{ position: "absolute", top: "2rem", left: "2rem" }}
              text="This is first video"
              direction="top"
            >
              <strong>ROOT</strong>
            </Tooltip>
          )}
          {currentNode.id === activeId && currentNode.id !== treeId && (
            <DoubleAngleLeftIcon
              style={{ top: "2.5rem", left: "2rem" }}
              onClick={() => activeNodeHandler(treeId)}
            />
          )}
          {currentNode.id === activeId && previousNode && (
            <AngleLeftIcon
              style={{ top: "2.5rem", left: "4.5rem" }}
              onClick={() => activeNodeHandler(previousNode.id)}
            />
          )}
        </div>
      )}

      <div className="upload-node__children">
        {currentNode.children.map((item) => (
          <UploadNode
            key={item.id}
            currentNode={item}
            previousNode={currentNode}
            treeId={treeId}
          />
        ))}
      </div>
    </div>
  );
};

export default UploadNode;
