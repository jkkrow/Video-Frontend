import React from "react";

import VideoPlayer from "../components/video/VideoPlayer";
import ExampleVid from "../assets/videos/vid_1_720p.mp4";
import "./VideoPage.css";

const VideoPage = (props) => {
  return (
    <div className="video-page">
      <VideoPlayer src={ExampleVid} />
      {/* <VideoPlayer src="https://vjs.zencdn.net/v/oceans.mp4" /> */}
    </div>
  );
};

export default VideoPage;
