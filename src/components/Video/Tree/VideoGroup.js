import { useContext } from "react";

import VideoPlayer from "../Player/VideoPlayer";
import { VideoContext } from "context/video-context";
import "./VideoGroup.css";

// "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd"
// "https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8"

const VideoGroup = ({ currentVideo, autoPlay, previousVideo }) => {
  const { activeVideo } = useContext(VideoContext);

  return (
    <>
      {(activeVideo.info.url === currentVideo?.info.url ||
        activeVideo.info.url === previousVideo?.info.url) && (
        <VideoPlayer
          src={currentVideo?.info.url}
          next={currentVideo.children}
          autoPlay={autoPlay}
          active={activeVideo.info.url === currentVideo?.info.url}
          previousVideo={previousVideo}
        />
      )}

      {currentVideo.children.length > 0 &&
        currentVideo.children.info &&
        currentVideo.children.map((video) => (
          <VideoGroup
            key={currentVideo.id}
            currentVideo={video}
            autoPlay={false}
            previousVideo={currentVideo}
          />
        ))}
    </>
  );
};

export default VideoGroup;
