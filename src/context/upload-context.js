import { createContext, useState } from "react";

export const UploadContext = createContext();

const UploadContextProvider = (props) => {
  const [whole, setWhole] = useState({
    file: null,
    next: [],
  });

  const initPart = (part) => {
    setWhole(part);
  };

  const addPart = (part, from) => {
    from.next.push();

    setWhole((prevState) => ({
      file: prevState.file,
      next: [...prevState.next, part],
    }));
  };

  return (
    <UploadContext.Provider value={{ whole, initPart, addPart }}>
      {props.children}
    </UploadContext.Provider>
  );
};

export default UploadContextProvider;
