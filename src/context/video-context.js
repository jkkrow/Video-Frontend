import { useState, createContext, useCallback, useEffect } from "react";

export const VideoContext = createContext();

const VideoContextProvider = ({ info, children }) => {
  const { tree, editMode, videoTreeRef } = info;

  const [activeVideo, setActiveVideo] = useState(tree.root);
  const [videoVolume, setVideoVolume] = useState(1);

  useEffect(() => {
    setActiveVideo(tree.root);
  }, [tree]);

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
        editMode,
        videoTreeRef,
        activeVideo,
        videoVolume,
        updateActiveVideo,
        updateVideoVolume,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
