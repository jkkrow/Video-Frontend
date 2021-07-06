import { useState, useRef, createContext, useCallback } from "react";

export const VideoContext = createContext();

const VideoContextProvider = ({ tree, editMode, children }) => {
  const [activeVideo, setActiveVideo] = useState(tree.root);
  const [videoVolume, setVideoVolume] = useState(1);

  const videoTreeRef = useRef();

  const updateActiveVideo = useCallback((video) => {
    setActiveVideo(video);
  }, []);

  const updateVideoVolume = useCallback((value) => {
    setVideoVolume(value);
  }, []);

  return (
    <VideoContext.Provider
      value={{
        tree,
        activeVideo,
        videoTreeRef,
        videoVolume,
        editMode,
        updateActiveVideo,
        updateVideoVolume,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
