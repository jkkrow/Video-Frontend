import VideoGroup from "./VideoGroup";
import VideoContextProvider from "context/video-context";
import "./VideoTree.css";

const VideoTree = ({ tree }) => {
  return (
    <VideoContextProvider>
      <div className="video-tree">
        <VideoGroup
          current={tree.root.info}
          next={tree.root.children}
          autoPlay={true}
        />
      </div>
    </VideoContextProvider>
  );
};

export default VideoTree;
