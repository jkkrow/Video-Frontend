import { createContext, useState } from "react";

import VideoClass from "classes/VideoClass";

export const UploadContext = createContext();

const UploadContextProvider = (props) => {
  const [whole, setWhole] = useState(new VideoClass(null));

  const appendNext = (name, from) => {
    if (!from) {
      return setWhole((prev) => {
        const newState = prev;
        newState.root.name = name;
        return newState;
      });
    }

    setWhole((prev) => {
      const newState = prev;
      newState.append(name, from);
      return newState;
    });
  };

  return (
    <UploadContext.Provider value={{ whole, appendNext }}>
      {props.children}
    </UploadContext.Provider>
  );
};

export default UploadContextProvider;
