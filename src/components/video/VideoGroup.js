import { useState, useContext } from "react";

import VideoPlayer from "./VideoPlayer";
import { VideoContext } from "context/video-context";

const VideoGroup = (props) => {
  const { currentVideo } = useContext(VideoContext);
  const { previousVideo, next, src, autoPlay, selected } = props;

  const [nextVideos, setNextVideos] = useState(next);

  return (
    <>
      {(currentVideo.src === src || currentVideo.src === previousVideo.src) && (
        <VideoPlayer src={src} autoPlay={autoPlay} selected={selected} />
      )}

      {nextVideos.length > 0 &&
        nextVideos.map((video) => (
          // Update nextVideos when NextSelector is clicked
          <VideoGroup
            key={video.src}
            previousVideo={currentVideo}
            next={video.children}
            src={video.src}
            autoPlay={false}
            selected={false}
          />
        ))}
    </>
  );
};

export default VideoGroup;
