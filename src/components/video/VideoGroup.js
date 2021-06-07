import { useContext } from "react";

import VideoPlayer from "./VideoPlayer";
import { VideoContext } from "./VideoTree";
import "./VideoGroup.css";

// import ExampleVid from "assets/videos/vid_1_720p.mp4";
// "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd"
// "https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8"

const VideoGroup = ({ current, next, autoPlay, previousVideo }) => {
  const { activeVideo } = useContext(VideoContext);

  return (
    <>
      {(activeVideo.info.src === current?.src ||
        activeVideo.info.src === previousVideo?.src) && (
        <VideoPlayer
          src={current?.src}
          next={next}
          autoPlay={autoPlay}
          active={activeVideo.info.src === current?.src}
        />
      )}

      {next.length > 0 &&
        next.map((video) => (
          <VideoGroup
            key={video.info.src}
            current={video.info}
            next={video.children}
            autoPlay={false}
            previousVideo={current}
          />
        ))}
    </>
  );
};

export default VideoGroup;
