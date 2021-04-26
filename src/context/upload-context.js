import { createContext, useState } from "react";

import VideoTree from "classes/VideoTree";

export const UploadContext = createContext();

const UploadContextProvider = (props) => {
  const [videoTree, setVideoTree] = useState(null);

  const initiateUpload = (file) => {
    setVideoTree(new VideoTree(file));
  };

  const appendNext = (files, parent) => {
    setVideoTree((prev) => {
      const newState = prev;
      files.forEach((file) => {
        newState.append(file, parent);
      });
      // newState.append(files, parent);
      return newState;
    });
  };

  return (
    <UploadContext.Provider value={{ videoTree, initiateUpload, appendNext }}>
      {props.children}
    </UploadContext.Provider>
  );
};

export default UploadContextProvider;
