import { useRef } from "react";

import VideoGroup from "./VideoGroup";
import VideoContextProvider from "context/video-context";
import "./VideoTree.css";

const VideoTree = ({ tree, autoPlay = true, editMode = false }) => {
  const videoTreeRef = useRef();

  return (
    <VideoContextProvider
      tree={tree}
      editMode={editMode}
      videoTreeRef={videoTreeRef}
    >
      <div className="video-tree" ref={videoTreeRef}>
        <VideoGroup currentVideo={tree.root} autoPlay={autoPlay} />
      </div>
    </VideoContextProvider>
  );
};

export default VideoTree;
