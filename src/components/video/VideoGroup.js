import { useState, useContext } from "react";

import VideoPlayer from "./VideoPlayer";
import { VideoContext } from "context/video-context";
// import ExampleVid from "assets/videos/vid_1_720p.mp4";
// "https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8"
import "./VideoGroup.css";

const VideoGroup = ({ current, next, autoPlay, previousVideo }) => {
  const { activeVideo } = useContext(VideoContext);

  const [nextVideos, setNextVideos] = useState(next);

  return (
    (activeVideo.src === current.src ||
      activeVideo.src === previousVideo.src) && (
      <>
        <VideoPlayer
          src={current.src}
          autoPlay={autoPlay}
          selected={activeVideo.src === current.src}
        />

        {nextVideos.length > 0 &&
          nextVideos.map((video) => (
            // Update nextVideos when NextSelector is clicked
            <VideoGroup
              key={video.info.src}
              current={video.info}
              next={video.children}
              autoPlay={false}
              previousVideo={current}
            />
          ))}
      </>
    )
  );
};

export default VideoGroup;
