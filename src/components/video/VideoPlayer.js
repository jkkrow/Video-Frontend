import { useEffect, useRef, useContext } from "react";

import { ReactComponent as PlayIcon } from "assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "assets/icons/pause.svg";
import { ReactComponent as VolumeHighIcon } from "assets/icons/volume-high.svg";
import { ReactComponent as VolumeMiddleIcon } from "assets/icons/volume-middle.svg";
import { ReactComponent as VolumeLowIcon } from "assets/icons/volume-low.svg";
import { ReactComponent as VolumeMuteIcon } from "assets/icons/volume-mute.svg";
import { ReactComponent as VolumeUpIcon } from "assets/icons/volume-up.svg";
import { ReactComponent as VolumeDownIcon } from "assets/icons/volume-down.svg";
import { ReactComponent as ForwardIcon } from "assets/icons/forward.svg";
import { ReactComponent as BackwardIcon } from "assets/icons/backward.svg";
import { ReactComponent as FullscreenIcon } from "assets/icons/fullscreen.svg";
import { ReactComponent as FullscreenExitIcon } from "assets/icons/fullscreen-exit.svg";
import { VideoContext } from "context/video-context";
import "./VideoPlayer.css";

const shaka = require("shaka-player/dist/shaka-player.ui.js");

let CONTROLSTIMER, BUFFERTIMER, VOLUMETIMER;

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

const VideoPlayer = ({ src, next, autoPlay, active }) => {
  const { updateActiveVideo } = useContext(VideoContext);

  const videoContainerRef = useRef();
  const videoRef = useRef();
  const videoControlsRef = useRef();
  const loadingSpinnerRef = useRef();
  const centerUIRef = useRef();
  const playButtonRef = useRef();
  const timeRef = useRef();
  const currentProgressRef = useRef();
  const bufferProgressRef = useRef();
  const seekProgressRef = useRef();
  const seekTooltipRef = useRef();
  const volumeButtonRef = useRef();
  const currentVolumeRef = useRef();
  const volumeInputRef = useRef();
  const fullscreenButtonRef = useRef();
  const selectorRef = useRef();

  /*
   * ERROR HANDLER
   */

  const errorHandler = (event) => {
    // Extract the shaka.util.Error object from the event.
    console.log("Error code", event.detail.code, "object", event.detail);
  };

  /*
   * DISPLAYING CENTER UI
   */

  const displayCenterUI = (index) => {
    if (index === 0) {
      // playback ui
      [...centerUIRef.current.children[index].children].forEach((icon) =>
        icon.classList.remove("hidden")
      );

      if (videoRef.current.paused) {
        centerUIRef.current.children[index].children[0].classList.add("hidden");
      } else {
        centerUIRef.current.children[index].children[1].classList.add("hidden");
      }
    } else {
      [...centerUIRef.current.children[index].children].forEach((icon) =>
        icon.classList.toggle("hidden")
      );
    }

    centerUIRef.current.children[index].animate(
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

  /*
   * TOGGLE SHOWING CONTROLS
   */

  const hideControls = () => {
    if (videoRef.current.paused) {
      return;
    }

    clearTimeout(CONTROLSTIMER);
    CONTROLSTIMER = setTimeout(() => {
      videoControlsRef.current.classList.add("hide");
      if (!videoRef.current.paused) {
        videoContainerRef.current.style.cursor = "none";
      }
    }, 2000);
  };

  const showControls = () => {
    videoControlsRef.current.classList.remove("hide");
    videoContainerRef.current.style.cursor = "default";

    hideControls();
  };

  /*
   * PLAYBACK CONTROL
   */

  const togglePlay = () => {
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }

    displayCenterUI(0);

    showControls();
  };

  const updatePlaybackIcon = () => {
    if (videoRef.current.ended) {
      [...centerUIRef.current.children[0].children].forEach((icon) =>
        icon.classList.toggle("hidden")
      );
    }

    [...playButtonRef.current.children].forEach((icon) => {
      icon.classList.toggle("hidden");
    });
  };

  /*
   * LOADING CONTROL
   */

  const showLoadingSpinner = () => {
    BUFFERTIMER = setTimeout(() => {
      loadingSpinnerRef.current.classList.remove("hidden");
    }, 300);
  };

  const hideLoadingSpinner = () => {
    clearTimeout(BUFFERTIMER);
    loadingSpinnerRef.current.classList.add("hidden");
  };

  /*
   * VOLUME CONTROL
   */

  const controlVolumeByInput = () => {
    videoRef.current.volume = volumeInputRef.current.value;
  };

  // const controlVolumeByKey = (direction) => {
  //   volumeInputRef.current.blur();

  //   switch (direction) {
  //     case "up":
  //       if (videoRef.current.volume + 0.05 > 1) {
  //         videoRef.current.volume = 1;
  //       } else {
  //         videoRef.current.volume = (videoRef.current.volume + 0.05).toFixed(2);
  //       }
  //       displayCenterUI(1);
  //       break;
  //     case "down":
  //       if (videoRef.current.volume - 0.05 < 0) {
  //         videoRef.current.volume = 0;
  //       } else {
  //         videoRef.current.volume = (videoRef.current.volume - 0.05).toFixed(2);
  //       }
  //       displayCenterUI(2);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const updateVolume = () => {
    const video = videoRef.current;
    const volumeIcons = [...volumeButtonRef.current.children];

    currentVolumeRef.current.style.width = video.volume * 100 + "%";
    volumeInputRef.current.value = video.volume;

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

    clearTimeout(VOLUMETIMER);
    VOLUMETIMER = setTimeout(() => {
      localStorage.setItem("video-volume", video.volume);
    }, 500);
  };

  const toggleMute = () => {
    if (videoRef.current.volume !== 0) {
      volumeInputRef.current.setAttribute(
        "data-volume",
        volumeInputRef.current.value
      );
      videoRef.current.volume = 0;
      volumeInputRef.current.value = 0;
      currentVolumeRef.current.style.width = 0;
    } else {
      videoRef.current.volume = volumeInputRef.current.dataset.volume;
      volumeInputRef.current.value = volumeInputRef.current.dataset.volume;
      currentVolumeRef.current.style.width =
        volumeInputRef.current.dataset.volume * 100 + "%";
    }
  };

  /*
   * TIME CONTROL
   */

  const updateTime = () => {
    const duration = videoRef.current.duration || 0;
    const currentTime = videoRef.current.currentTime || 0;
    const buffer = videoRef.current.buffered;

    // Progress UI
    seekProgressRef.current.value = currentTime;
    currentProgressRef.current.style.width =
      (currentTime / duration) * 100 + "%";

    // Buffer UI
    if (duration > 0) {
      for (let i = 0; i < buffer.length; i++) {
        if (
          buffer.start(buffer.length - 1 - i) === 0 ||
          buffer.start(buffer.length - 1 - i) < videoRef.current.currentTime
        ) {
          bufferProgressRef.current.style.width =
            (buffer.end(buffer.length - 1 - i) / duration) * 100 + "%";
          break;
        }
      }
    }

    // Time UI
    const remainedTime = formatTime(duration - currentTime);
    timeRef.current.innerText = remainedTime;
    timeRef.current.setAttribute("datetime", remainedTime);

    // Show navigation menu if certain time is reached
    if (currentTime / duration > 0.9) {
      selectorRef.current.classList.add("active");

      // Hide controls UI & Block show controls on mouse move
    }
  };

  /*
   * SKIP CONTROL
   */

  const updateSeekTooltip = (event) => {
    const skipTo =
      (event.nativeEvent.offsetX / event.target.clientWidth) *
      parseInt(event.target.getAttribute("max"), 10);

    seekProgressRef.current.setAttribute("data-seek", skipTo);

    let newTime;
    if (skipTo > videoRef.current.duration) {
      newTime = formatTime(videoRef.current.duration);
    } else if (skipTo < 0) {
      newTime = "00:00";
    } else {
      newTime = formatTime(skipTo);
    }

    seekTooltipRef.current.textContent = newTime;

    const rect = videoRef.current.getBoundingClientRect();

    seekTooltipRef.current.style.left = `${event.pageX - rect.left}px`;
  };

  const skipByInput = (event) => {
    const skipTo = event.target.dataset.seek
      ? event.target.dataset.seek
      : event.target.value;

    videoRef.current.currentTime = skipTo;
    seekProgressRef.current.value = skipTo;
    currentProgressRef.current.style.width =
      (skipTo / videoRef.current.duration) * 100 + "%";
  };

  // const skipByKey = (direction) => {
  //   seekProgressRef.current.blur();

  //   switch (direction) {
  //     case "forward":
  //       videoRef.current.currentTime += 10;
  //       displayCenterUI(3);
  //       break;
  //     case "backward":
  //       videoRef.current.currentTime -= 10;
  //       displayCenterUI(4);
  //       break;
  //     default:
  //       return;
  //   }

  //   showControls();
  // };

  /*
   * FULLSCREEN CONTROL
   */

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.querySelector(".video-tree").requestFullscreen();
    }
  };

  const updateFullscreenIcon = () => {
    [...fullscreenButtonRef.current.children].forEach((icon) =>
      icon.classList.toggle("hidden")
    );
  };

  /*
   * KEYBOARD SHORTKUTS
   */

  // const keyboardShortcuts = (event) => {
  //   event.preventDefault();
  //   const { key } = event;

  //   switch (key) {
  //     case "ArrowRight":
  //       // Forward 10 seconds
  //       skipByKey("forward");
  //       break;
  //     case "ArrowLeft":
  //       // Rewind 10 seconds
  //       skipByKey("backward");
  //       break;
  //     case "ArrowUp":
  //       // Volume Up
  //       controlVolumeByKey("up");
  //       break;
  //     case "ArrowDown":
  //       // Volume Down
  //       controlVolumeByKey("down");
  //       break;
  //     case " ":
  //       togglePlay();
  //       break;
  //     default:
  //       return;
  //   }
  // };

  /*
   * INITIALIZE VIDEO
   */

  const initializeVideo = () => {
    if (!videoRef.current.canPlayType) {
      videoRef.current.controls = true;
      videoControlsRef.current.classList.add("hidden");
    }

    videoRef.current.volume = localStorage.getItem("video-volume");

    const videoDuration = videoRef.current.duration;
    seekProgressRef.current.setAttribute("max", videoDuration);
    currentProgressRef.current.setAttribute("max", videoDuration);

    updateTime();

    // document.addEventListener("keyup", keyboardShortcuts);
    document.addEventListener("fullscreenchange", updateFullscreenIcon);
  };

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
    <div
      className="vp-container"
      ref={videoContainerRef}
      onMouseMove={showControls}
      onMouseLeave={hideControls}
      // onContextMenu={(e) => e.preventDefault()}
      style={{ display: active ? "" : "none" }}
    >
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        onLoadedMetadata={initializeVideo}
        onClick={togglePlay}
        onPlay={updatePlaybackIcon}
        onPause={updatePlaybackIcon}
        onVolumeChange={updateVolume}
        onTimeUpdate={updateTime}
        onDoubleClick={toggleFullscreen}
        onWaiting={showLoadingSpinner}
        onCanPlay={hideLoadingSpinner}
        onError={errorHandler}
      />

      <div className="vp-controls" ref={videoControlsRef}>
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
          <div className="vp-controls__range--outer">
            <div className="vp-controls__range--inner">
              <div className="vp-controls__range--background" />
              <div
                className="vp-controls__range--current"
                ref={currentVolumeRef}
              />
              <input
                className="vp-controls__range--seek"
                ref={volumeInputRef}
                type="range"
                onInput={controlVolumeByInput}
                max="1"
                step="0.05"
                onKeyDown={(e) => e.preventDefault()}
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
            ref={seekProgressRef}
            defaultValue="0"
            step="0.1"
            type="range"
            onMouseMove={updateSeekTooltip}
            onInput={skipByInput}
            onKeyDown={(e) => e.preventDefault()}
          />
          <span
            className="vp-controls__range--seek-tooltip"
            ref={seekTooltipRef}
          >
            00:00
          </span>
        </div>

        <div className="vp-controls__time">
          <time ref={timeRef} />
        </div>

        <div
          className="vp-controls__btn"
          ref={fullscreenButtonRef}
          onClick={toggleFullscreen}
        >
          <FullscreenIcon />
          <FullscreenExitIcon className="hidden" />
        </div>
      </div>

      {/* Loading Spinner */}
      <div className="vp-loader__container" ref={loadingSpinnerRef}>
        <div className="vp-loader" />
      </div>

      {/* Center UI */}
      <div className="vp-center-ui" ref={centerUIRef}>
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

      {/* Next Video Selector */}
      <div className="vp-selector__container" ref={selectorRef}>
        {next.map((video) => (
          <div
            className="vp-selector"
            onClick={() => updateActiveVideo(video.info.optionTitle)}
          >
            {video.info.optionTitle}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
