import { useDispatch, useSelector } from "react-redux";

import DragDrop from "components/FormElement/DragDrop";
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
import "./UploadNode.css";

const UploadNode = ({ currentNode, previousNode, treeId }) => {
  const dispatch = useDispatch();

  const { activeId } = useSelector((state) => state.upload);

  const activeNodeHandler = (id) => {
    dispatch(updateActiveNode(id));
  };

  const addChildHandler = () => {
    dispatch(appendChild(currentNode.id));
  };

  const removeNodeHandler = () => {
    dispatch(removeNode(currentNode.id));

    if (currentNode.id === activeId) {
      dispatch(updateActiveNode(previousNode.id));
    }
  };

  const onFileHandler = (file) => {
    dispatch(attachVideo(file, currentNode.id, treeId));
  };

  const labelChangeHandler = (event) => {
    dispatch(updateNode({ label: event.target.value }, currentNode.id));
  };

  return (
    <div
      className={`upload-node${currentNode.id === activeId ? " active" : ""}`}
    >
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
                  currentNode.id === activeId && previousNode ? " parent" : ""
                }`}
                onClick={() => activeNodeHandler(currentNode.id)}
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
                    data-description="Mark timeline with button below Video Player."
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
                top: "1.55rem",
                left: "-4rem",
                width: "2.4rem",
                height: "2.4rem",
              }}
              onClick={removeNodeHandler}
            />
          )}
          {currentNode.children.length < 4 && currentNode.id === activeId && (
            <PlusIcon
              style={{ top: "2rem", right: "2rem" }}
              onClick={addChildHandler}
            />
          )}
          {currentNode.id === activeId && previousNode && (
            <AngleLeftIcon
              style={{ top: "2rem", left: "4rem" }}
              onClick={() => activeNodeHandler(previousNode.id)}
            />
          )}
          {currentNode.id === activeId && currentNode.id !== treeId && (
            <DoubleAngleLeftIcon
              style={{ top: "2rem", left: "2rem" }}
              onClick={() => activeNodeHandler(treeId)}
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
