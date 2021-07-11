import { createContext, useCallback, useEffect, useState } from "react";
import { Prompt } from "react-router-dom";
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

      const newNode = { id: uuidv1(), info: fileInfo, children: [] };
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

  useEffect(() => {
    if (!JSON.parse(videoTree).root) return;

    const beforeunloadHandler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", beforeunloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeunloadHandler);
    };
  }, [videoTree]);

  console.log(JSON.parse(videoTree).root);

  return (
    <UploadContext.Provider
      value={{
        videoTree: JSON.parse(videoTree),
        initiateUpload,
        appendNext,
        updateNode,
      }}
    >
      <Prompt
        when={!!JSON.parse(videoTree).root}
        message="Are you sure you want to leave? Your upload progress will be lost!"
      />
      {children}
    </UploadContext.Provider>
  );
};

export default UploadContextProvider;
