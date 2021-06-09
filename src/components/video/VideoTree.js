import { useState, useEffect, useRef, createContext } from "react";

import VideoGroup from "./VideoGroup";
import "./VideoTree.css";

export const VideoContext = createContext();

const VideoTree = ({ tree, autoPlay = true }) => {
  const [activeVideo, setActiveVideo] = useState(tree.root);
  const [videoVolume, setVideoVolume] = useState();

  const videoTreeRef = useRef();

  const updateActiveVideo = (title) => {
    setActiveVideo((prev) =>
      prev.children.find((video) => video.info.optionTitle === title)
    );
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
        activeVideo,
        videoVolume,
        videoTreeRef,
        updateActiveVideo,
        updateVideoVolume,
      }}
    >
      <div className="video-tree" ref={videoTreeRef}>
        <VideoGroup
          current={tree.root.info}
          next={tree.root.children}
          autoPlay={autoPlay}
          activeVideo={activeVideo}
          updateActiveVideo={updateActiveVideo}
        />
      </div>
    </VideoContext.Provider>
  );
};

export default VideoTree;
