import { useEffect, useContext } from "react";

import VideoGroup from "./VideoGroup";
import VideoContextProvider, { VideoContext } from "context/video-context";
import "./VideoTree.css";

const VideoTree = ({ tree, autoPlay = true, editMode = false }) => {
  const { videoTreeRef, updateActiveVideo } = useContext(VideoContext);

  useEffect(() => {
    updateActiveVideo(tree.root);
  }, [tree, updateActiveVideo]);

  return (
    <VideoContextProvider tree={tree} editMode={editMode}>
      <div className="video-tree" ref={videoTreeRef}>
        <VideoGroup currentVideo={tree.root} autoPlay={autoPlay} />
      </div>
    </VideoContextProvider>
  );
};

export default VideoTree;
