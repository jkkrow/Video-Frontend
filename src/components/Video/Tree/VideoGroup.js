import { useSelector } from "react-redux";

import VideoPlayer from "../Player/VideoPlayer";
import "./VideoGroup.css";

// "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd"
// "https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8"

const VideoGroup = ({ currentVideo, autoPlay, editMode, previousVideo }) => {
  const { activeVideo } = useSelector((state) => state.video);

  return (
    <>
      {(activeVideo.info.url === currentVideo?.info.url ||
        activeVideo.info.url === previousVideo?.info.url) && (
        <VideoPlayer
          src={currentVideo?.info.url}
          next={currentVideo.children}
          autoPlay={autoPlay}
          editMode={editMode}
          active={activeVideo.info.url === currentVideo?.info.url}
          previousVideo={previousVideo}
        />
      )}

      {currentVideo.children.length > 0 &&
        currentVideo.children.map(
          (video) =>
            video.info && (
              <VideoGroup
                key={video.id}
                currentVideo={video}
                autoPlay={false}
                editMode={editMode}
                previousVideo={currentVideo}
              />
            )
        )}
    </>
  );
};

export default VideoGroup;
