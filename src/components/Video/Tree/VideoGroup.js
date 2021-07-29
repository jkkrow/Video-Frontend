import { useSelector } from "react-redux";

import VideoPlayer from "../Player/VideoPlayer";
import "./VideoGroup.css";

const VideoGroup = ({ currentVideo, autoPlay, editMode, previousVideo }) => {
  const { activeVideo } = useSelector((state) => state.video);

  return (
    <>
      {(currentVideo.id === activeVideo.id ||
        previousVideo?.id === activeVideo.id) && (
        <VideoPlayer
          currentVideo={currentVideo}
          autoPlay={autoPlay}
          editMode={editMode}
          active={activeVideo.id === currentVideo.id}
          previousVideo={previousVideo}
        />
      )}

      {currentVideo.children.map(
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
