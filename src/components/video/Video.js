import { useState, useEffect, useContext, forwardRef } from "react";

import { VideoContext } from "context/video-context";
import "./Video.css";
const shaka = require("shaka-player/dist/shaka-player.ui.js");

const Video = forwardRef((props, videoRef) => {
  const { src, autoPlay, show } = props;

  useEffect(() => {
    // If src type is Blob
    if (src.substr(0, 4) === "blob")
      return videoRef.current.setAttribute("src", src);

    // Connect video to Shaka Player
    let player = new shaka.Player(videoRef.current);

    // Try to load a manifest (async process).
    player
      .load(src)
      .then(() => {})
      .catch((err) => console.log(err));
  }, [src, videoRef]);

  return (
    <video
      ref={videoRef}
      autoPlay={autoPlay}
      style={{ display: show ? "block" : "none" }}
      onLoadedMetadata={props.initializeVideo}
      onClick={props.togglePlay}
      onPlay={props.updatePlaybackIcon}
      onPause={props.updatePlaybackIcon}
      onVolumeChange={props.updateVolume}
      onTimeUpdate={props.updateTime}
      onDoubleClick={props.toggleFullscreen}
      onWaiting={props.showLoadingSpinner}
      onCanPlay={props.hideLoadingSpinner}
      onError={props.errorHandler}
    />
  );
});

const VideoGroup = forwardRef((props, ref) => {
  const { currentVideo } = useContext(VideoContext);
  const { previousVideo, next, src, autoPlay, selected } = props;

  const [nextVideos, setNextVideos] = useState(next);

  return (
    <>
      {(currentVideo.src === src || previousVideo?.src === src) && (
        <Video
          {...props}
          ref={ref}
          src={src}
          autoPlay={autoPlay}
          show={selected}
        />
      )}

      {nextVideos.length > 0 &&
        nextVideos.map((video) => (
          // Update nextVideos when NextSelector is clicked
          <VideoGroup
            {...props}
            ref={ref}
            previousVideo={currentVideo}
            next={video.children}
            src={video.src}
            autoPlay={false}
            selected={false}
          />
        ))}
    </>
  );
});

export default VideoGroup;
