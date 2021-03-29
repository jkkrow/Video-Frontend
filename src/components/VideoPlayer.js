import React, { useEffect } from "react";

import { ReactComponent as PlayIcon } from "../assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "../assets/icons/pause.svg";
import { ReactComponent as VolumeHighIcon } from "../assets/icons/volume-high.svg";
import { ReactComponent as VolumeMiddleIcon } from "../assets/icons/volume-middle.svg";
import { ReactComponent as VolumeLowIcon } from "../assets/icons/volume-low.svg";
import { ReactComponent as VolumeMuteIcon } from "../assets/icons/volume-mute.svg";
import { ReactComponent as VolumeUpIcon } from "../assets/icons/volume-up.svg";
import { ReactComponent as VolumeDownIcon } from "../assets/icons/volume-down.svg";
import { ReactComponent as ForwardIcon } from "../assets/icons/forward.svg";
import { ReactComponent as BackwardIcon } from "../assets/icons/backward.svg";
import { ReactComponent as FullscreenIcon } from "../assets/icons/fullscreen.svg";
import { ReactComponent as FullscreenExitIcon } from "../assets/icons/fullscreen-exit.svg";
import { useVideoPlayerControls } from "../hooks/video-player-hook";
import "./VideoPlayer.css";

const VideoPlayer = ({ src, type }) => {
  const {
    vidContainerRef,
    vidRef,
    vidControlsRef,
    loadingSpinnerRef,
    actionUIRef,
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
    hideControls,
    showControls,
    togglePlay,
    updatePlaybackIcon,
    showLoadingSpinner,
    hideLoadingSpinner,
    updateTime,
    updateSeekTooltip,
    skipByInput,
    controlVolumeByInput,
    updateVolume,
    toggleMute,
    toggleFullScreen,
    initializeVideo,
  } = useVideoPlayerControls();

  useEffect(() => {
    vidRef.current.setAttribute("src", src);
  }, [vidRef, src]);

  return (
    <div
      className="vp-container"
      ref={vidContainerRef}
      onMouseMove={showControls}
      onMouseLeave={hideControls}
      // onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={vidRef}
        autoPlay
        onLoadedMetadata={initializeVideo}
        onClick={togglePlay}
        onPlay={updatePlaybackIcon}
        onPause={updatePlaybackIcon}
        onVolumeChange={updateVolume}
        onTimeUpdate={updateTime}
        onDoubleClick={toggleFullScreen}
        onWaiting={showLoadingSpinner}
        onCanPlay={hideLoadingSpinner}
      >
        <source src={src} type={type} />
      </video>
      <div className="vp-controls" ref={vidControlsRef}>
        <div className="vp-controls__playback">
          <div
            className="vp-controls__btn"
            ref={playButtonRef}
            onClick={togglePlay}
          >
            <PlayIcon />
            <PauseIcon className="hidden" />
          </div>
        </div>

        <div className="vp-controls__volume">
          <div
            className="vp-controls__btn"
            ref={volumeButtonRef}
            onClick={toggleMute}
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
                className="vp-controls__range--current"
                ref={currentVolumeRef}
              />
              <input
                ref={volumeInputRef}
                type="range"
                onInput={controlVolumeByInput}
                max="1"
                step="0.05"
              />
            </div>
          </div>
        </div>

        <div className="vp-controls__progress">
          <div className="vp-controls__range--background" />
          <div className="vp-controls__range--buffer" ref={bufferProgressRef} />
          <div
            className="vp-controls__range--current"
            ref={currentProgressRef}
          />
          <input
            className="vp-controls__range--seek"
            ref={seekRef}
            defaultValue="0"
            step="0.1"
            type="range"
            onMouseMove={updateSeekTooltip}
            onInput={skipByInput}
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
          onClick={toggleFullScreen}
        >
          <FullscreenIcon />
          <FullscreenExitIcon className="hidden" />
        </div>
      </div>

      {/* Loading Spinner */}
      <div className="lds-spinner__container" ref={loadingSpinnerRef}>
        <div className="lds-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      {/* Action UI */}
      <div className="action-ui" ref={actionUIRef}>
        <div>
          <PlayIcon />
          <PauseIcon className="hidden" />
        </div>
        <div>
          <VolumeUpIcon />
          <VolumeUpIcon className="hidden" />
        </div>
        <div>
          <VolumeDownIcon />
          <VolumeDownIcon className="hidden" />
        </div>
        <div>
          <ForwardIcon />
          <ForwardIcon className="hidden" />
        </div>
        <div>
          <BackwardIcon />
          <BackwardIcon className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
