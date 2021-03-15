import React, { useRef } from "react";

import { ReactComponent as PlayIcon } from "../assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "../assets/icons/pause.svg";
import { ReactComponent as BackwardIcon } from "../assets/icons/backward.svg";
import { ReactComponent as ForwardIcon } from "../assets/icons/forward.svg";
import { ReactComponent as VolumeHighIcon } from "../assets/icons/volume-high.svg";
import { ReactComponent as VolumeLowIcon } from "../assets/icons/volume-low.svg";
import { ReactComponent as VolumeMuteIcon } from "../assets/icons/volume-mute.svg";
import { ReactComponent as FullscreenIcon } from "../assets/icons/fullscreen.svg";
import { ReactComponent as FullscreenExitIcon } from "../assets/icons/fullscreen-exit.svg";
import LoadingSpinner from "./LoadingSpinner";
import { useVideoPlayerControls } from "../hooks/vp-controls";
import "./VideoPlayer.css";

const Video = (props) => {
  const vidContainerRef = useRef();
  const vidRef = useRef();
  const playbackAnimationRef = useRef();
  const forwardAnimationRef = useRef();
  const backwardAnimationRef = useRef();
  const vidControlsRef = useRef();
  const playButtonRef = useRef();
  const timeElapsedRef = useRef();
  const durationRef = useRef();
  const progressBarRef = useRef();
  const seekRef = useRef();
  const seekTooltipRef = useRef();
  const volumeButtonRef = useRef();
  const volumeInputRef = useRef();
  const fullScreenButtonRef = useRef();

  const {
    loaded,
    setLoaded,
    hideControls,
    showControls,
    togglePlay,
    updatePlaybackIcon,
    updateTime,
    updateSeekTooltip,
    skipAhead,
    updateVolume,
    updateVolumeIcon,
    toggleMute,
    toggleFullScreen,
    initializeVideo,
  } = useVideoPlayerControls();

  return (
    <div
      className="video-container"
      ref={vidContainerRef}
      onMouseMove={() => showControls(vidContainerRef, vidRef, vidControlsRef)}
      onMouseLeave={() => hideControls(vidRef, vidControlsRef)}
      // onContextMenu={(e) => e.preventDefault()}
    >
      {!loaded && <LoadingSpinner />}

      <video
        ref={vidRef}
        id={props.id}
        poster={props.poster}
        onClick={() => togglePlay(vidContainerRef, vidRef, vidControlsRef)}
        onPlay={() =>
          updatePlaybackIcon(vidRef, playbackAnimationRef, playButtonRef)
        }
        onPause={() =>
          updatePlaybackIcon(vidRef, playbackAnimationRef, playButtonRef)
        }
        onLoadedMetadata={() =>
          initializeVideo(
            vidContainerRef,
            vidRef,
            vidControlsRef,
            progressBarRef,
            seekRef,
            durationRef,
            volumeInputRef,
            forwardAnimationRef,
            backwardAnimationRef,
            fullScreenButtonRef
          )
        }
        onLoadStart={() => setLoaded(false)}
        onTimeUpdate={() =>
          updateTime(vidRef, progressBarRef, seekRef, timeElapsedRef)
        }
        onVolumeChange={() => updateVolumeIcon(vidRef, volumeButtonRef)}
        onDoubleClick={() => toggleFullScreen(vidContainerRef)}
      >
        <source src={props.src} type={props.type} />
      </video>

      <div className="playback-animation" ref={playbackAnimationRef}>
        <PlayIcon className="hidden" />
        <PauseIcon />
      </div>

      <div className="playback-animation" ref={forwardAnimationRef}>
        <ForwardIcon />
        <ForwardIcon className="hidden" />
      </div>

      <div className="playback-animation" ref={backwardAnimationRef}>
        <BackwardIcon />
        <BackwardIcon className="hidden" />
      </div>

      <div className="video-controls" ref={vidControlsRef}>
        <div className="video-controls__progress">
          <progress ref={progressBarRef} min="0"></progress>
          <input
            className="seek"
            ref={seekRef}
            defaultValue="0"
            min="0"
            step="0.1"
            type="range"
            onMouseMove={(event) =>
              updateSeekTooltip(event, vidRef, seekRef, seekTooltipRef)
            }
            onChange={(event) =>
              skipAhead(event, vidRef, progressBarRef, seekRef)
            }
          />
          <div className="seek-tooltip" ref={seekTooltipRef}>
            00:00
          </div>
        </div>

        <div className="video-controls__bottom">
          <div className="video-controls__bottom--left">
            <div className="video-controls__playback">
              <div
                className="video-controls__btn"
                ref={playButtonRef}
                onClick={() =>
                  togglePlay(vidContainerRef, vidRef, vidControlsRef)
                }
              >
                <PlayIcon />
                <PauseIcon className="hidden" />
              </div>
            </div>

            <div className="video-controls__volume">
              <div
                className="video-controls__btn volume-button"
                ref={volumeButtonRef}
                onClick={() => toggleMute(vidRef, volumeInputRef)}
              >
                <VolumeHighIcon />
                <VolumeLowIcon className="hidden" />
                <VolumeMuteIcon className="hidden" />
              </div>
              <input
                className="volume"
                ref={volumeInputRef}
                onInput={() => updateVolume(vidRef, volumeInputRef)}
                type="range"
                max="1"
                min="0"
                step="0.01"
              />
            </div>

            <div className="video-controls__time">
              <time ref={timeElapsedRef}>00:00</time>
              <span> / </span>
              <time ref={durationRef}>00:00</time>
            </div>
          </div>

          <div className="video-controls__bottom--right">
            <div
              className="video-controls__btn fullscreen-button"
              ref={fullScreenButtonRef}
              onClick={() => toggleFullScreen(vidContainerRef)}
              id="fullscreen-button"
            >
              <FullscreenIcon />
              <FullscreenExitIcon className="hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
