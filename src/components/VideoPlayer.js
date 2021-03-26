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
import ActionUI from "./ActionUI";
import "./VideoPlayer.css";

let CONTROLSTIMER, BUFFERTIMER;

const displayActionUI = (element, index) => {
  [...element.current.children[index].children].forEach((icon) =>
    icon.classList.toggle("hidden")
  );

  element.current.children[index].animate(
    [
      {
        opacity: 1,
        transform: "scale(1)",
      },
      {
        opacity: 0,
        transform: "scale(1.3)",
      },
    ],
    { duration: 800 }
  );
};

const formatTime = (timeInSeconds) => {
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
  // if duration is over hour
  if (Number(result.substr(0, 2)) > 0) {
    // show 00:00:00
    return result;
  } else {
    // else show 00:00
    return result.substr(3);
  }
};

const VideoPlayer = (props) => {
  const vidContainerRef = useRef();
  const vidRef = useRef();
  const vidControlsRef = useRef();
  const loadingSpinnerRef = useRef();
  const actionUIRef = useRef();
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

  // TOGGLE SHOWING CONTROLS
  const hideControls = () => {
    if (vidRef.current.paused) {
      return;
    }

    clearTimeout(CONTROLSTIMER);
    CONTROLSTIMER = setTimeout(() => {
      vidControlsRef.current.classList.add("hide");
      if (!vidRef.current.paused) {
        vidContainerRef.current.style.cursor = "none";
      }
    }, 2000);
  };

  const showControls = () => {
    vidControlsRef.current.classList.remove("hide");
    vidContainerRef.current.style.cursor = "default";

    hideControls();
  };

  // PLAYBACK CONTROL

  const togglePlay = () => {
    if (vidRef.current.paused || vidRef.current.ended) {
      vidRef.current.play();
    } else {
      vidRef.current.pause();
    }

    showControls();
  };

  const updatePlaybackIcon = () => {
    [...playButtonRef.current.children].forEach((icon) =>
      icon.classList.toggle("hidden")
    );

    if (!vidRef.current.ended) {
      displayActionUI(actionUIRef, 0);
    } else {
      [...actionUIRef.current.children[0].children].forEach((icon) =>
        icon.classList.toggle("hidden")
      );
    }
  };

  // LOADING CONTROL
  const showLoadingSpinner = () => {
    BUFFERTIMER = setTimeout(() => {
      loadingSpinnerRef.current.classList.remove("hidden");
    }, 300);
  };

  const hideLoadingSpinner = () => {
    clearTimeout(BUFFERTIMER);
    loadingSpinnerRef.current.classList.add("hidden");
  };

  // VOLUME CONTROL

  const controlVolumeByInput = () => {
    vidRef.current.volume = volumeInputRef.current.value;
    currentVolumeRef.current.style.width =
      volumeInputRef.current.value * 100 + "%";
  };

  const controlVolumeByKey = (direction) => {
    volumeInputRef.current.blur();

    switch (direction) {
      case "up":
        if (vidRef.current.volume + 0.05 > 1) {
          vidRef.current.volume = 1;
        } else {
          vidRef.current.volume = (vidRef.current.volume + 0.05).toFixed(2);
        }
        displayActionUI(actionUIRef, 1);
        break;
      case "down":
        if (vidRef.current.volume - 0.05 < 0) {
          vidRef.current.volume = 0;
        } else {
          vidRef.current.volume = (vidRef.current.volume - 0.05).toFixed(2);
        }
        displayActionUI(actionUIRef, 2);
        break;
      default:
        break;
    }

    currentVolumeRef.current.style.width = vidRef.current.volume * 100 + "%";
    volumeInputRef.current.value = vidRef.current.volume;
  };

  const updateVolume = () => {
    const video = vidRef.current;
    const volumeIcons = [...volumeButtonRef.current.children];

    if (video.volume === 0) {
      video.muted = true;
    } else {
      video.muted = false;
      volumeInputRef.current.setAttribute(
        "data-volume",
        volumeInputRef.current.value
      );
    }

    volumeIcons.forEach((icon) => {
      icon.classList.add("hidden");
    });

    if (video.muted || video.volume === 0) {
      volumeIcons[3].classList.remove("hidden");
    } else if (video.volume > 0 && video.volume < 0.3) {
      volumeIcons[2].classList.remove("hidden");
    } else if (video.volume >= 0.3 && video.volume < 0.7) {
      volumeIcons[1].classList.remove("hidden");
    } else {
      volumeIcons[0].classList.remove("hidden");
    }
  };

  const toggleMute = () => {
    if (vidRef.current.volume !== 0) {
      volumeInputRef.current.setAttribute(
        "data-volume",
        volumeInputRef.current.value
      );
      vidRef.current.volume = 0;
      volumeInputRef.current.value = 0;
      currentVolumeRef.current.style.width = 0;
    } else {
      vidRef.current.volume = volumeInputRef.current.dataset.volume;
      volumeInputRef.current.value = volumeInputRef.current.dataset.volume;
      currentVolumeRef.current.style.width =
        volumeInputRef.current.dataset.volume * 100 + "%";
    }
  };

  // TIME CONTROL

  const updateTime = () => {
    const duration = vidRef.current.duration;
    const currentTime = vidRef.current.currentTime;
    const buffer = vidRef.current.buffered;

    // Progress UI
    seekRef.current.value = currentTime;
    currentProgressRef.current.style.width =
      (currentTime / duration) * 100 + "%";

    // Buffer UI
    if (duration > 0) {
      for (let i = 0; i < buffer.length; i++) {
        if (buffer.start(buffer.length - 1 - i) < vidRef.current.currentTime) {
          bufferProgressRef.current.style.width =
            (buffer.end(buffer.length - 1 - i) / duration) * 100 + "%";
          break;
        }
      }
    }

    // Time UI
    const remainedTime = formatTime(duration - currentTime);

    durationRef.current.innerText = remainedTime;
    durationRef.current.setAttribute("datetime", remainedTime);
  };

  // SKIP CONTROL

  const updateSeekTooltip = (event) => {
    const skipTo =
      (event.nativeEvent.offsetX / event.target.clientWidth) *
      parseInt(event.target.getAttribute("max"), 10);

    seekRef.current.setAttribute("data-seek", skipTo);
    let newTime;
    if (skipTo > vidRef.current.duration) {
      newTime = formatTime(vidRef.current.duration);
    } else if (skipTo < 0) {
      newTime = "00:00";
    } else {
      newTime = formatTime(skipTo);
    }
    seekTooltipRef.current.textContent = newTime;
    const rect = vidRef.current.getBoundingClientRect();
    seekTooltipRef.current.style.left = `${event.pageX - rect.left}px`;
  };

  const skipByInput = (event) => {
    event.preventDefault();

    const skipTo = event.target.dataset.seek
      ? event.target.dataset.seek
      : event.target.value;

    vidRef.current.currentTime = skipTo;
    seekRef.current.value = skipTo;
    currentProgressRef.current.style.width =
      (skipTo / vidRef.current.duration) * 100 + "%";
  };

  const skipByKey = (direction) => {
    seekRef.current.blur();

    switch (direction) {
      case "forward":
        vidRef.current.currentTime += 10;
        displayActionUI(actionUIRef, 3);
        break;
      case "backward":
        vidRef.current.currentTime -= 10;
        displayActionUI(actionUIRef, 4);
        break;
      default:
        return;
    }

    showControls();
  };
  // FULLSCREEN CONTROL

  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      vidContainerRef.current.requestFullscreen();
    }
  };

  const updateFullscreenIcon = () => {
    [...fullScreenButtonRef.current.children].forEach((icon) =>
      icon.classList.toggle("hidden")
    );
  };

  // KEYBOARD SHORTKUTS

  const keyboardShortcuts = (event) => {
    const { key } = event;

    switch (key) {
      case "ArrowRight":
        // Forward 10 seconds
        skipByKey("forward");
        break;
      case "ArrowLeft":
        // Rewind 10 seconds
        skipByKey("backward");
        break;
      case "ArrowUp":
        // Volume Up
        controlVolumeByKey("up");
        break;
      case "ArrowDown":
        // Volume Down
        controlVolumeByKey("down");
        break;

      case " ":
        togglePlay();
        break;
      default:
        return;
    }
  };

  // INITIALIZE VIDEO

  const initializeVideo = () => {
    if (!vidRef.current.canPlayType) {
      vidRef.current.controls = true;
      vidControlsRef.current.classList.add("hidden");
    }

    const videoDuration = vidRef.current.duration;
    seekRef.current.setAttribute("max", videoDuration);
    currentProgressRef.current.setAttribute("max", videoDuration);

    const result = formatTime(videoDuration);
    durationRef.current.innerText = result;
    durationRef.current.setAttribute("datetime", result);

    document.addEventListener("keyup", (event) => keyboardShortcuts(event));
    document.addEventListener("fullscreenchange", () => updateFullscreenIcon());
  };

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
        id={props.id}
        poster={props.poster}
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
        <source src={props.src} type={props.type} />
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
                ref={currentVolumeRef}
                className="vp-controls__range--current"
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

      <LoadingSpinner ref={loadingSpinnerRef} />
      <ActionUI ref={actionUIRef} />
    </div>
  );
};

export default VideoPlayer;
