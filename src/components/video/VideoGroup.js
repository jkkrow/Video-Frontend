import { useContext } from "react";

import VideoPlayer from "./VideoPlayer";
import { VideoContext } from "./VideoTree";
import "./VideoGroup.css";

// import ExampleVid from "assets/videos/vid_1_720p.mp4";
// "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd"
// "https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8"

const VideoGroup = ({ currentVideo, autoPlay, previousVideo }) => {
  const { activeVideo } = useContext(VideoContext);

  return (
    <>
      {(activeVideo.info.src === currentVideo?.info.src ||
        activeVideo.info.src === previousVideo?.info.src) && (
        <VideoPlayer
          src={currentVideo?.info.src}
          next={currentVideo.children}
          autoPlay={autoPlay}
          active={activeVideo.info.src === currentVideo?.info.src}
          previousVideo={previousVideo}
        />
      )}

      {currentVideo.children.length > 0 &&
        currentVideo.children.map((video) => (
          <VideoGroup
            key={`${video.info.layer}:${video.info.src}-${video.info.optionTitle}`}
            currentVideo={video}
            autoPlay={false}
            previousVideo={currentVideo}
          />
        ))}
    </>
  );
};

export default VideoGroup;
