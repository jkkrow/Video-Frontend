import { useState, useRef, useContext } from "react";
import { CSSTransition } from "react-transition-group";
// import axios from "axios";

import { ReactComponent as Right } from "assets/icons/right-angle.svg";
import { ReactComponent as Plus } from "assets/icons/plus.svg";
import { UploadContext } from "context/upload-context";
import "./TreeNode.css";

const TreeNode = ({ node }) => {
  const { appendNext } = useContext(UploadContext);
  const [openChildren, setOpenChildren] = useState(false);
  const fileUploaderRef = useRef();

  const displayChildrenHandler = () => setOpenChildren((prev) => !prev);

  const openFileInputHandler = () => fileUploaderRef.current.click();

  const fileChangeHandler = async (event) => {
    if (!event.target.files?.length) return;

    const files = [...event.target.files];

    // Add to entire upload tree
    appendNext(files, node.title);

    // Upload file to AWS S3
    // for (let i = 0; i < files.length; i++) {
    //   const uploadConfig = await axios.get(
    //     `${process.env.REACT_APP_SERVER_URL}/upload`
    //   );

    //   await axios.put(uploadConfig.data.url, files[i], {
    //     headers: { "Content-Type": files[i].type },
    //     onUploadProgress: (progressEvent) => {
    //       console.log(progressEvent);
    //     },
    //   });
    // }
  };

  return (
    <div className="tree-node">
      <div className="tree-node__header">
        <input
          ref={fileUploaderRef}
          hidden
          multiple
          type="file"
          accept=".mp4"
          onChange={fileChangeHandler}
        />
        <Right
          className={`tree-node__open-children ${openChildren && "rotate"}`}
          onClick={displayChildrenHandler}
        />
        <div>test</div>
        <div className="tree-node__progress"></div>
        <Plus onClick={openFileInputHandler} />
      </div>

      <CSSTransition
        classNames="tree-node-display"
        in={openChildren}
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
        <div className="tree-node__children">
          {node.children.map((child) => {
            <TreeNode key={child} />;
          })}
          <div>test1</div>
          <div>test2</div>
          <div>test3</div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default TreeNode;
