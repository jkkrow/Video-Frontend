import { useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

let CONTROLSTIMER, BUFFERTIMER;

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

export const useVideoPlayerControls = () => {
  const videoContainerRef = useRef();
  const videoRef = useRef();
  const videoControlsRef = useRef();
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

  const location = useLocation();

  /*
   * ERROR HANDLER
   */

  const onError = useCallback((error) => {
    console.error("Error code", error.code, "object", error);
  }, []);

  const onErrorEvent = useCallback(
    (event) => {
      // Extract the shaka.util.Error object from the event.
      onError(event.detail);
    },
    [onError]
  );

  /*
   * DISPLAYING ACTION UI
   */

  const displayActionUI = useCallback((element, index) => {
    if (index === 0) {
      // playback ui
      [...element.current.children[index].children].forEach((icon) =>
        icon.classList.remove("hidden")
      );

      if (videoRef.current.paused) {
        element.current.children[index].children[0].classList.add("hidden");
      } else {
        element.current.children[index].children[1].classList.add("hidden");
      }
    } else {
      [...element.current.children[index].children].forEach((icon) =>
        icon.classList.toggle("hidden")
      );
    }

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
  }, []);

  /*
   * TOGGLE SHOWING CONTROLS
   */

  const hideControls = useCallback(() => {
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
  }, []);

  const showControls = useCallback(() => {
    videoControlsRef.current.classList.remove("hide");
    videoContainerRef.current.style.cursor = "default";

    hideControls();
  }, [hideControls]);

  /*
   * PLAYBACK CONTROL
   */

  const togglePlay = useCallback(() => {
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }

    displayActionUI(actionUIRef, 0);

    showControls();
  }, [showControls, displayActionUI]);

  const updatePlaybackIcon = useCallback(() => {
    if (videoRef.current.ended) {
      [...actionUIRef.current.children[0].children].forEach((icon) =>
        icon.classList.toggle("hidden")
      );
    }

    [...playButtonRef.current.children].forEach((icon) => {
      icon.classList.toggle("hidden");
    });
  }, []);

  /*
   * LOADING CONTROL
   */

  const showLoadingSpinner = useCallback(() => {
    BUFFERTIMER = setTimeout(() => {
      loadingSpinnerRef.current.classList.remove("hidden");
    }, 300);
  }, []);

  const hideLoadingSpinner = useCallback(() => {
    clearTimeout(BUFFERTIMER);
    loadingSpinnerRef.current.classList.add("hidden");
  }, []);

  /*
   * VOLUME CONTROL
   */

  const controlVolumeByInput = useCallback(() => {
    videoRef.current.volume = volumeInputRef.current.value;
    currentVolumeRef.current.style.width =
      volumeInputRef.current.value * 100 + "%";
  }, []);

  const controlVolumeByKey = useCallback(
    (direction) => {
      volumeInputRef.current.blur();

      switch (direction) {
        case "up":
          if (videoRef.current.volume + 0.05 > 1) {
            videoRef.current.volume = 1;
          } else {
            videoRef.current.volume = (videoRef.current.volume + 0.05).toFixed(
              2
            );
          }
          displayActionUI(actionUIRef, 1);
          break;
        case "down":
          if (videoRef.current.volume - 0.05 < 0) {
            videoRef.current.volume = 0;
          } else {
            videoRef.current.volume = (videoRef.current.volume - 0.05).toFixed(
              2
            );
          }
          displayActionUI(actionUIRef, 2);
          break;
        default:
          break;
      }

      currentVolumeRef.current.style.width =
        videoRef.current.volume * 100 + "%";
      volumeInputRef.current.value = videoRef.current.volume;
    },
    [displayActionUI]
  );

  const updateVolume = useCallback(() => {
    const video = videoRef.current;
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
  }, []);

  const toggleMute = useCallback(() => {
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
  }, []);

  /*
   * TIME CONTROL
   */

  const updateTime = useCallback(() => {
    const duration = videoRef.current.duration || 0;
    const currentTime = videoRef.current.currentTime || 0;
    const buffer = videoRef.current.buffered;

    // Progress UI
    seekRef.current.value = currentTime;
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
    durationRef.current.innerText = remainedTime;
    durationRef.current.setAttribute("datetime", remainedTime);
  }, []);

  /*
   * SKIP CONTROL
   */

  const updateSeekTooltip = useCallback((event) => {
    const skipTo =
      (event.nativeEvent.offsetX / event.target.clientWidth) *
      parseInt(event.target.getAttribute("max"), 10);

    seekRef.current.setAttribute("data-seek", skipTo);

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
  }, []);

  const skipByInput = useCallback((event) => {
    const skipTo = event.target.dataset.seek
      ? event.target.dataset.seek
      : event.target.value;

    videoRef.current.currentTime = skipTo;
    seekRef.current.value = skipTo;
    currentProgressRef.current.style.width =
      (skipTo / videoRef.current.duration) * 100 + "%";
  }, []);

  const skipByKey = useCallback(
    (direction) => {
      seekRef.current.blur();

      switch (direction) {
        case "forward":
          videoRef.current.currentTime += 10;
          displayActionUI(actionUIRef, 3);
          break;
        case "backward":
          videoRef.current.currentTime -= 10;
          displayActionUI(actionUIRef, 4);
          break;
        default:
          return;
      }

      showControls();
    },
    [showControls, displayActionUI]
  );

  /*
   * FULLSCREEN CONTROL
   */

  const toggleFullScreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoContainerRef.current.requestFullscreen();
    }
  }, []);

  const updateFullscreenIcon = useCallback(() => {
    [...fullScreenButtonRef.current.children].forEach((icon) =>
      icon.classList.toggle("hidden")
    );
  }, []);

  /*
   * KEYBOARD SHORTKUTS
   */

  const keyboardShortcuts = useCallback(
    (event) => {
      event.preventDefault();
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
    },
    [skipByKey, controlVolumeByKey, togglePlay]
  );

  /*
   * INITIALIZE VIDEO
   */

  const initializeVideo = useCallback(() => {
    if (!videoRef.current.canPlayType) {
      videoRef.current.controls = true;
      videoControlsRef.current.classList.add("hidden");
    }

    const videoDuration = videoRef.current.duration;
    seekRef.current.setAttribute("max", videoDuration);
    currentProgressRef.current.setAttribute("max", videoDuration);

    updateTime();

    document.addEventListener("fullscreenchange", updateFullscreenIcon);

    if (location.pathname === "/") {
      document.addEventListener("keyup", keyboardShortcuts);
    }
  }, [updateTime, updateFullscreenIcon, location, keyboardShortcuts]);

  return {
    videoContainerRef,
    videoRef,
    videoControlsRef,
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
    onError,
    onErrorEvent,
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
  };
};
