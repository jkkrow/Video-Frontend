import React, { useRef } from "react";

import { ReactComponent as PlayIcon } from "../assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "../assets/icons/pause.svg";
import { ReactComponent as VolumeHighIcon } from "../assets/icons/volume-high.svg";
import { ReactComponent as VolumeLowIcon } from "../assets/icons/volume-low.svg";
import { ReactComponent as VolumeMuteIcon } from "../assets/icons/volume-mute.svg";
import { ReactComponent as FullscreenIcon } from "../assets/icons/fullscreen.svg";
import { ReactComponent as FullscreenExitIcon } from "../assets/icons/fullscreen-exit.svg";
import LoadingSpinner from "./LoadingSpinner";
import PlaybackAnimation from "./PlaybackAnimation";
import { useVideoPlayerControls } from "../hooks/vp-controls";
import "./VideoPlayer.css";

const Video = (props) => {
  const vidContainerRef = useRef();
  const vidRef = useRef();
  const vidControlsRef = useRef();
  const playbackAnimationRef = useRef();
  const forwardAnimationRef = useRef();
  const backwardAnimationRef = useRef();
  const volumeUpAnimationRef = useRef();
  const volumeDownAnimationRef = useRef();
  const playButtonRef = useRef();
  const durationRef = useRef();
  const currentProgressRef = useRef();
  const bufferProgressRef = useRef();
  const seekRef = useRef();
  const seekTooltipRef = useRef();
  const volumeButtonRef = useRef();
  const currentVolumeRef = useRef();
  const volumeInputRef = useRef();
  const fullScreenButtonRef = useRef();

  const refObject = {
    vidContainerRef,
    vidRef,
    vidControlsRef,
    playbackAnimationRef,
    forwardAnimationRef,
    backwardAnimationRef,
    volumeUpAnimationRef,
    volumeDownAnimationRef,
    playButtonRef,
    durationRef,
    currentProgressRef,
    bufferProgressRef,
    seekRef,
    seekTooltipRef,
    volumeButtonRef,
    currentVolumeRef,
    volumeInputRef,
    fullScreenButtonRef,
  };

  const {
    loading,
    hideControls,
    showControls,
    togglePlay,
    updatePlaybackIcon,
    videoBuffering,
    finishedBuffer,
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
      className="vp-container"
      ref={vidContainerRef}
      onMouseMove={() => showControls(refObject)}
      onMouseLeave={() => hideControls(refObject)}
      // onContextMenu={(e) => e.preventDefault()}
    >
      {loading && <LoadingSpinner />}

      <PlaybackAnimation
        playbackRef={playbackAnimationRef}
        forwardRef={forwardAnimationRef}
        backwardRef={backwardAnimationRef}
        upRef={volumeUpAnimationRef}
        downRef={volumeDownAnimationRef}
      />

      <video
        ref={vidRef}
        id={props.id}
        poster={props.poster}
        onClick={() => togglePlay(refObject)}
        onPlay={() => updatePlaybackIcon(refObject)}
        onPause={() => updatePlaybackIcon(refObject)}
        onLoadedMetadata={() => initializeVideo(refObject)}
        onTimeUpdate={() => updateTime(refObject)}
        onVolumeChange={() => updateVolumeIcon(refObject)}
        onDoubleClick={() => toggleFullScreen(refObject)}
        onWaiting={() => videoBuffering()}
        onCanPlay={() => finishedBuffer()}
      >
        <source src={props.src} type={props.type} />
      </video>

      <div className="vp-controls" ref={vidControlsRef}>
        <div className="vp-controls__playback">
          <div
            className="vp-controls__btn"
            ref={playButtonRef}
            onClick={() => togglePlay(refObject)}
          >
            <PlayIcon />
            <PauseIcon className="hidden" />
          </div>
        </div>

        <div className="vp-controls__volume">
          <div
            className="vp-controls__btn"
            ref={volumeButtonRef}
            onClick={() => toggleMute(refObject)}
          >
            <VolumeHighIcon />
            <VolumeLowIcon className="hidden" />
            <VolumeMuteIcon className="hidden" />
          </div>
          <div className="vp-controls__volume__range--outer">
            <div className="vp-controls__volume__range--inner">
              <div className="vp-controls__range--background" />
              <div
                ref={currentVolumeRef}
                className="vp-controls__range--current"
              />
              <input
                ref={volumeInputRef}
                type="range"
                onInput={() => updateVolume(refObject)}
                max="1"
                step="0.05"
              />
            </div>
          </div>
        </div>

        <div className="vp-controls__progress">
          <div className="vp-controls__range--background" />
          <div ref={bufferProgressRef} className="vp-controls__range--buffer" />
          <div
            ref={currentProgressRef}
            className="vp-controls__range--current"
          />
          <input
            className="vp-controls__range--seek"
            ref={seekRef}
            defaultValue="0"
            step="0.1"
            type="range"
            onMouseMove={(e) => updateSeekTooltip(e, refObject)}
            onChange={(e) => skipAhead(e, refObject)}
          />
          <span
            className="vp-controls__range--seek-tooltip"
            ref={seekTooltipRef}
          >
            00:00
          </span>
        </div>

        <div className="vp-controls__time">
          <time ref={durationRef}>00:00</time>
        </div>

        <div
          className="vp-controls__btn"
          ref={fullScreenButtonRef}
          onClick={() => toggleFullScreen(refObject)}
        >
          <FullscreenIcon />
          <FullscreenExitIcon className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default Video;
