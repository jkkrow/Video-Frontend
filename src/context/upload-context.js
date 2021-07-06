import { createContext, useCallback, useState } from "react";
import { v1 as uuidv1 } from "uuid";

import { findNode } from "util/findNode";

export const UploadContext = createContext();

const UploadContextProvider = ({ children }) => {
  const [videoTree, setVideoTree] = useState(JSON.stringify({}));

  const initiateUpload = useCallback((fileInfo) => {
    setVideoTree(
      JSON.stringify({
        root: {
          id: uuidv1(),
          info: fileInfo,
          children: [],
        },
      })
    );
  }, []);

  const appendNext = useCallback((fileInfo, parent) => {
    setVideoTree((prev) => {
      const newState = JSON.parse(prev);

      const parentNode = findNode(newState, parent);

      if (!parentNode) return;

      const newNode = { info: fileInfo, children: [] };
      parentNode.children = [...parentNode.children, newNode];

      return JSON.stringify(newState);
    });
  }, []);

  const updateNode = useCallback((node) => {
    setVideoTree((prev) => {
      const newState = JSON.parse(prev);

      const targetNode = findNode(newState, node);

      if (!targetNode) return;
    });
  }, []);

  return (
    <UploadContext.Provider
      value={{
        videoTree: JSON.parse(videoTree),
        initiateUpload,
        appendNext,
        updateNode,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export default UploadContextProvider;
