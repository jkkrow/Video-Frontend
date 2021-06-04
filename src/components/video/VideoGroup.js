import { useContext } from "react";

import VideoPlayer from "./VideoPlayer";
import { VideoContext } from "context/video-context";
// import ExampleVid from "assets/videos/vid_1_720p.mp4";
// "https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8"
import "./VideoGroup.css";

const VideoGroup = ({ current, next, autoPlay, previousVideo }) => {
  const { activeVideo } = useContext(VideoContext);

  return (
    (activeVideo.src === current.src ||
      activeVideo.src === previousVideo.src) && (
      <>
        <VideoPlayer
          src={current.src}
          autoPlay={autoPlay}
          selected={activeVideo.src === current.src}
        />

        {next.length > 0 &&
          next.map((video) => (
            <VideoGroup
              key={video.info.src}
              current={video.info}
              next={video.children}
              autoPlay={false}
              previousVideo={current.info}
            />
          ))}
      </>
    )
  );
};

export default VideoGroup;
