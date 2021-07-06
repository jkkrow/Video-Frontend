import { useRef } from "react";

import VideoGroup from "./VideoGroup";
import VideoContextProvider from "context/video-context";
import "./VideoTree.css";

const VideoTree = ({ tree, autoPlay = true, editMode = false }) => {
  const videoTreeRef = useRef();

  return (
    <VideoContextProvider info={{ tree, editMode, videoTreeRef }}>
      <div className="video-tree" ref={videoTreeRef}>
        <VideoGroup currentVideo={tree.root} autoPlay={autoPlay} />
      </div>
    </VideoContextProvider>
  );
};

export default VideoTree;
