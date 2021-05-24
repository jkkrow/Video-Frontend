import { createContext, useState } from "react";

export const UploadContext = createContext({
  videoTree: {},
  initiateUpload: () => {},
  appendNext: () => {},
});

const UploadContextProvider = (props) => {
  const [videoTree, setVideoTree] = useState(null);

  const initiateUpload = (fileInfo) => {
    setVideoTree(
      JSON.stringify({ root: { info: fileInfo, children: [] } }, null, 3)
    );
  };

  const _findNode = (node, name, layer) => {
    let currentNode = node.root;
    let queue = [];

    queue.push(currentNode);

    while (queue.length > 0) {
      currentNode = queue.shift();

      if (currentNode.info.name === name && currentNode.info.layer === layer)
        return currentNode;

      if (currentNode.children.length)
        currentNode.children.forEach((child) => queue.push(child));
    }

    return null;
  };

  const appendNext = (fileInfos, parent) => {
    setVideoTree((prev) => {
      const newState = JSON.parse(prev);

      const parentNode = _findNode(newState, parent.name, parent.layer);

      if (!parentNode) return;

      fileInfos.forEach((fileInfo) => {
        const newNode = { info: fileInfo, children: [] };
        parentNode.children = [...parentNode.children, newNode];
      });

      return JSON.stringify(newState, null, 3);
    });
  };

  const updateNode = (node) => {
    setVideoTree((prev) => {
      const newState = JSON.parse(prev);

      const targetNode = _findNode(newState, node.info.name, node.info.layer);

      if (!targetNode) return;
    });
  };

  return (
    <UploadContext.Provider value={{ videoTree, initiateUpload, appendNext }}>
      {props.children}
    </UploadContext.Provider>
  );
};

export default UploadContextProvider;
