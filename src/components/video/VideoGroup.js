import { useState } from "react";

import VideoPlayer from "./VideoPlayer";
import NextSelector from "./NextSelector";
import "./VideoGroup.css";

const VideoGroup = () => {
  const [currentVideo, setCurrentVideo] = useState();
  const [nextVideos, setNextVideos] = useState([]);

  return (
    <div className="video-group">
      <div className="current-video"></div>
      <div className="next-videos">
        {nextVideos.map((vid) => (
          <VideoPlayer />
        ))}
      </div>

      <NextSelector />
    </div>
  );
};

export default VideoGroup;
