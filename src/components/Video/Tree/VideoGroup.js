import { useSelector } from "react-redux";

import VideoPlayer from "../Player/VideoPlayer";
import "./VideoGroup.css";

const VideoGroup = ({ currentVideo, autoPlay, editMode, previousVideo }) => {
  const { activeVideo } = useSelector((state) => state.video);

  return (
    <>
      {(activeVideo.id === currentVideo?.id ||
        activeVideo.id === previousVideo?.id) && (
        <VideoPlayer
          src={currentVideo?.info.url}
          next={currentVideo.children}
          autoPlay={autoPlay}
          editMode={editMode}
          active={activeVideo.id === currentVideo?.id}
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
