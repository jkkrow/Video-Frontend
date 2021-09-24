import { useSelector } from "react-redux";

import VideoPlayer from "../Player/VideoPlayer";
import "./VideoNode.css";

const VideoNode = ({ currentVideo, autoPlay, editMode, previousVideo }) => {
  const { activeId } = useSelector((state) => state.video);

  return (
    <>
      {(currentVideo.id === activeId || previousVideo?.id === activeId) && (
        <VideoPlayer
          currentVideo={currentVideo}
          autoPlay={autoPlay}
          editMode={editMode}
          active={activeId === currentVideo.id}
          previousVideo={previousVideo}
        />
      )}

      {currentVideo.children.map(
        (video) =>
          video.info && (
            <VideoNode
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

export default VideoNode;
