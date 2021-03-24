import React from "react";

import VideoPlayer from "../components/VideoPlayer";
import ExampleVid from "../assets/videos/vid_1_720p.mp4";
import "./Video.css";

const Video = (props) => {
  return (
    <div className="video">
      <VideoPlayer src={ExampleVid} />
      {/* <VideoPlayer src="https://vjs.zencdn.net/v/oceans.mp4" /> */}
    </div>
  );
};

export default Video;
