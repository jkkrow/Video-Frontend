import React, { useRef, useState } from "react";

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
  const [loading, setLoading] = useState(true);

  const vidContainerRef = useRef();
  const vidRef = useRef();
  const vidControlsRef = useRef();
  const playbackAnimationRef = useRef();
  const forwardAnimationRef = useRef();
  const backwardAnimationRef = useRef();
  const playButtonRef = useRef();
  const durationRef = useRef();
  const progressBarRef = useRef();
  const bufferRef = useRef();
  const seekRef = useRef();
  const seekTooltipRef = useRef();
  const volumeButtonRef = useRef();
  const volumeProgressRef = useRef();
  const volumeInputRef = useRef();
  const fullScreenButtonRef = useRef();

  const refObject = {
    vidContainerRef,
    vidRef,
    vidControlsRef,
    playbackAnimationRef,
    forwardAnimationRef,
    backwardAnimationRef,
    playButtonRef,
    durationRef,
    progressBarRef,
    bufferRef,
    seekRef,
    seekTooltipRef,
    volumeButtonRef,
    volumeProgressRef,
    volumeInputRef,
    fullScreenButtonRef,
  };

  const {
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
      />

      <video
        ref={vidRef}
        id={props.id}
        poster={props.poster}
        onClick={() => togglePlay(refObject)}
        onPlay={() => updatePlaybackIcon(refObject)}
        onPause={() => updatePlaybackIcon(refObject)}
        onLoadedMetadata={() => initializeVideo(refObject, setLoading)}
        onTimeUpdate={() => updateTime(refObject)}
        onVolumeChange={() => updateVolumeIcon(refObject)}
        onDoubleClick={() => toggleFullScreen(refObject)}
        onLoadStart={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
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
              <progress ref={volumeProgressRef} max="1" value="1" />
              <input
                ref={volumeInputRef}
                type="range"
                onInput={() => updateVolume(refObject)}
                max="1"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="vp-controls__progress">
          <div className="vp-controls__progress--background" />
          <div ref={bufferRef} className="vp-controls__progress--buffer" />
          <div
            ref={progressBarRef}
            className="vp-controls__progress--current"
          />
          {/* <progress ref={progressBarRef} /> */}
          <input
            className="vp-controls__progress--seek"
            ref={seekRef}
            defaultValue="0"
            step="0.1"
            type="range"
            onMouseMove={(e) => updateSeekTooltip(e, refObject)}
            onChange={(e) => skipAhead(e, refObject)}
          />
          <span
            className="vp-controls__progress--seek-tooltip"
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
