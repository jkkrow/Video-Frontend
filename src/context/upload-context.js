import { createContext, useState } from "react";

export const UploadContext = createContext({
  videoTree: {},
  initiateUpload: () => {},
  appendNext: () => {},
  updateNode: () => {}
});

const UploadContextProvider = (props) => {
  const [videoTree, setVideoTree] = useState(null);

  const initiateUpload = (fileInfo) => {
    setVideoTree(
      JSON.stringify(
        {
          root: { info: fileInfo, children: [] },
        },
        null,
        3
      )
    );
  };

  const _findNode = (tree, node) => {
    let currentNode = tree.root;
    let queue = [];

    queue.push(currentNode);

    while (queue.length > 0) {
      currentNode = queue.shift();

      if (
        currentNode.info.name === node.file.name &&
        currentNode.info.layer === node.layer &&
        currentNode.info.optionTitle === node.optionTitle
      )
        return currentNode;

      if (currentNode.children.length)
        currentNode.children.forEach((child) => queue.push(child));
    }

    return null;
  };

  const appendNext = (fileInfo, parent) => {
    setVideoTree((prev) => {
      const newState = JSON.parse(prev);

      const parentNode = _findNode(newState, parent);

      if (!parentNode) return;

      const newNode = { info: fileInfo, children: [] };
      parentNode.children = [...parentNode.children, newNode];

      return JSON.stringify(newState, null, 3);
    });
  };

  const updateNode = (node) => {
    setVideoTree((prev) => {
      const newState = JSON.parse(prev);

      const targetNode = _findNode(newState, node);

      if (!targetNode) return;
    });
  };

  return (
    <UploadContext.Provider
      value={{
        videoTree,
        initiateUpload,
        appendNext,
        updateNode,
      }}
    >
      {props.children}
    </UploadContext.Provider>
  );
};

export default UploadContextProvider;
