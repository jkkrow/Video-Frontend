import { useState, useEffect, useRef, createContext } from "react";

import VideoGroup from "./VideoGroup";
import "./VideoTree.css";

export const VideoContext = createContext();

const VideoTree = ({ tree, autoPlay = true, editMode = false }) => {
  const [activeVideo, setActiveVideo] = useState(tree.root);
  const [videoVolume, setVideoVolume] = useState(1);

  const videoTreeRef = useRef();

  const updateActiveVideo = (video) => {
    setActiveVideo(video);
  };

  const updateVideoVolume = (value) => {
    setVideoVolume(value);
  };

  useEffect(() => {
    setActiveVideo(tree.root);
  }, [tree]);

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
      <div className="video-tree" ref={videoTreeRef}>
        <VideoGroup currentVideo={tree.root} autoPlay={autoPlay} />
      </div>
    </VideoContext.Provider>
  );
};

export default VideoTree;
