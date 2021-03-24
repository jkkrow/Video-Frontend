import React, { useRef } from "react";

import { ReactComponent as PlayIcon } from "../assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "../assets/icons/pause.svg";
import { ReactComponent as VolumeHighIcon } from "../assets/icons/volume-high.svg";
import { ReactComponent as VolumeMiddleIcon } from "../assets/icons/volume-middle.svg";
import { ReactComponent as VolumeLowIcon } from "../assets/icons/volume-low.svg";
import { ReactComponent as VolumeMuteIcon } from "../assets/icons/volume-mute.svg";
import { ReactComponent as FullscreenIcon } from "../assets/icons/fullscreen.svg";
import { ReactComponent as FullscreenExitIcon } from "../assets/icons/fullscreen-exit.svg";
import LoadingSpinner from "./LoadingSpinner";
import CenterDisplay from "./CenterDisplay";
import { useVideoPlayerControls } from "../hooks/vp-controls";
import "./VideoPlayer.css";

const VideoPlayer = (props) => {
  const vidContainerRef = useRef();
  const vidRef = useRef();
  const vidControlsRef = useRef();
  const playbackDisplayRef = useRef();
  const forwardDisplayRef = useRef();
  const backwardDisplayRef = useRef();
  const volumeUpDisplayRef = useRef();
  const volumeDownDisplayRef = useRef();
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
    playbackDisplayRef,
    forwardDisplayRef,
    backwardDisplayRef,
    volumeUpDisplayRef,
    volumeDownDisplayRef,
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
    videoBufferStart,
    videoBufferFinish,
    updateTime,
    updateSeekTooltip,
    skipByInput,
    controlVolumeByInput,
    updateVolume,
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

      <CenterDisplay
        playbackRef={playbackDisplayRef}
        forwardRef={forwardDisplayRef}
        backwardRef={backwardDisplayRef}
        upRef={volumeUpDisplayRef}
        downRef={volumeDownDisplayRef}
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
        onVolumeChange={() => updateVolume(refObject)}
        onDoubleClick={() => toggleFullScreen(refObject)}
        onWaiting={() => videoBufferStart()}
        onCanPlay={() => videoBufferFinish()}
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
            <VolumeMiddleIcon className="hidden" />
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
                onInput={() => controlVolumeByInput(refObject)}
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
            onInput={(e) => skipByInput(e, refObject)}
          />
          <span
            className="vp-controls__range--seek-tooltip"
            ref={seekTooltipRef}
          >
            00:00
          </span>
        </div>

        <div className="vp-controls__time">
          <time ref={durationRef}></time>
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

export default VideoPlayer;
