import { useEffect, useState, createContext } from "react";

import VideoGroup from "./VideoGroup";
import "./VideoTree.css";

export const VideoContext = createContext({
  activeVideo: {},
  updateActiveVideo: () => {},
});

const VideoTree = ({ tree, autoPlay = true }) => {
  const [activeVideo, setActiveVideo] = useState(tree.root);

  const updateActiveVideo = (title) => {
    setActiveVideo((prev) =>
      prev.children.find((video) => video.info.optionTitle === title)
    );
  };

  useEffect(() => {
    setActiveVideo(tree.root);
  }, [tree]);

  return (
    <VideoContext.Provider value={{ activeVideo, updateActiveVideo }}>
      <div className="video-tree">
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
