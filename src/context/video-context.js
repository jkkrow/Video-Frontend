import { createContext, useState } from "react";

export const VideoContext = createContext({
  activeVideo: {},
  initiateVideo: () => {},
  updateActiveVideo: () => {},
});

const VideoContextProvider = ({ children }) => {
  const [activeVideo, setActiveVideo] = useState();

  const initiateVideo = (tree) => {
    setActiveVideo(tree.root);
  };

  const updateActiveVideo = (title) => {
    setActiveVideo((prev) =>
      prev.children.find((video) => video.info.optionTitle === title)
    );
  };

  return (
    <VideoContext.Provider
      value={{ activeVideo, initiateVideo, updateActiveVideo }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
