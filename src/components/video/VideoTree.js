import { useContext, useEffect } from "react";

import VideoGroup from "./VideoGroup";
import VideoContextProvider, { VideoContext } from "context/video-context";
import "./VideoTree.css";

const VideoTree = ({ tree }) => {
  const { initiateVideo } = useContext(VideoContext);

  useEffect(() => {
    initiateVideo(tree);
  }, [initiateVideo, tree]);

  return (
    <div className="video-tree">
      <VideoGroup
        current={tree.root.info}
        next={tree.root.children}
        autoPlay={true}
      />
    </div>
  );
};

const VideoContextTree = ({ tree }) => (
  <VideoContextProvider>
    <VideoTree tree={tree} />
  </VideoContextProvider>
);

export default VideoContextTree;
