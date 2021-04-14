import React from "react";

import VideoPlayer from "components/video/VideoPlayer";
// import VideoShakaPlayer from "components/video/VideoShakaPlayer";
// import ExampleVid from "assets/videos/vid_1_720p.mp4";
import "./VideoPage.css";

const VideoPage = () => {
  return (
    <div className="video-page">
      <VideoPlayer src="https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd" />
      {/* <VideoPlayer src="https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8" /> */}
      {/* <VideoPlayer src="https://vjs.zencdn.net/v/oceans.mp4" /> */}
      {/* <VideoShakaPlayer src="https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd" /> */}
    </div>
  );
};

export default VideoPage;
