import { createContext, useState } from "react";

import VideoTree from "classes/VideoTree";

export const UploadContext = createContext();

const UploadContextProvider = (props) => {
  const [videoTree, setVideoTree] = useState(new VideoTree(null));

  const inititateUpload = (name) => {
    setVideoTree((prev) => {
      const newState = prev;
      newState.root.name = name;
      return newState;
    });
  };

  const appendNext = (files, parent) => {
    setVideoTree((prev) => {
      const newState = prev;
      files.forEach((file) => {
        newState.append(file.name, parent);
      });
      // newState.append(files, parent);
      return newState;
    });
  };

  return (
    <UploadContext.Provider value={{ videoTree, inititateUpload, appendNext }}>
      {props.children}
    </UploadContext.Provider>
  );
};

export default UploadContextProvider;
