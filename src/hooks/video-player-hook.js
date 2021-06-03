import { useRef, useCallback } from "react";

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

export const useVideoPlayerControls = () => {
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

  /*
   * ERROR HANDLER
   */

  const errorHandler = useCallback((event) => {
    // Extract the shaka.util.Error object from the event.
    console.log("Error code", event.detail.code, "object", event.detail);
  }, []);

  /*
   * DISPLAYING CENTER UI
   */

  const displayCenterUI = useCallback((index) => {
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

    displayCenterUI(0);

    showControls();
  }, [showControls, displayCenterUI]);

  const updatePlaybackIcon = useCallback(() => {
    if (videoRef.current.ended) {
      [...centerUIRef.current.children[0].children].forEach((icon) =>
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
  }, []);

  // const controlVolumeByKey = useCallback(
  //   (direction) => {
  //     volumeInputRef.current.blur();

  //     switch (direction) {
  //       case "up":
  //         if (videoRef.current.volume + 0.05 > 1) {
  //           videoRef.current.volume = 1;
  //         } else {
  //           videoRef.current.volume = (videoRef.current.volume + 0.05).toFixed(
  //             2
  //           );
  //         }
  //         displayCenterUI(1);
  //         break;
  //       case "down":
  //         if (videoRef.current.volume - 0.05 < 0) {
  //           videoRef.current.volume = 0;
  //         } else {
  //           videoRef.current.volume = (videoRef.current.volume - 0.05).toFixed(
  //             2
  //           );
  //         }
  //         displayCenterUI(2);
  //         break;
  //       default:
  //         break;
  //     }
  //   },
  //   [displayCenterUI]
  // );

  const updateVolume = useCallback(() => {
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

    // Navigate to Next Video

    /// Show navigation menu if certain time is reached

    /// Hide controls UI & Block show controls on mouse move
  }, []);

  /*
   * SKIP CONTROL
   */

  const updateSeekTooltip = useCallback((event) => {
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
  }, []);

  const skipByInput = useCallback((event) => {
    const skipTo = event.target.dataset.seek
      ? event.target.dataset.seek
      : event.target.value;

    videoRef.current.currentTime = skipTo;
    seekProgressRef.current.value = skipTo;
    currentProgressRef.current.style.width =
      (skipTo / videoRef.current.duration) * 100 + "%";
  }, []);

  // const skipByKey = useCallback(
  //   (direction) => {
  //     seekProgressRef.current.blur();

  //     switch (direction) {
  //       case "forward":
  //         videoRef.current.currentTime += 10;
  //         displayCenterUI(3);
  //         break;
  //       case "backward":
  //         videoRef.current.currentTime -= 10;
  //         displayCenterUI(4);
  //         break;
  //       default:
  //         return;
  //     }

  //     showControls();
  //   },
  //   [showControls, displayCenterUI]
  // );

  /*
   * FULLSCREEN CONTROL
   */

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.querySelector(".video-tree").requestFullscreen();
    }
  }, []);

  const updateFullscreenIcon = useCallback(() => {
    [...fullscreenButtonRef.current.children].forEach((icon) =>
      icon.classList.toggle("hidden")
    );
  }, []);

  /*
   * KEYBOARD SHORTKUTS
   */

  // const keyboardShortcuts = useCallback(
  //   (event) => {
  //     event.preventDefault();
  //     const { key } = event;

  //     switch (key) {
  //       case "ArrowRight":
  //         // Forward 10 seconds
  //         skipByKey("forward");
  //         break;
  //       case "ArrowLeft":
  //         // Rewind 10 seconds
  //         skipByKey("backward");
  //         break;
  //       case "ArrowUp":
  //         // Volume Up
  //         controlVolumeByKey("up");
  //         break;
  //       case "ArrowDown":
  //         // Volume Down
  //         controlVolumeByKey("down");
  //         break;
  //       case " ":
  //         togglePlay();
  //         break;
  //       default:
  //         return;
  //     }
  //   },
  //   [skipByKey, controlVolumeByKey, togglePlay]
  // );

  /*
   * INITIALIZE VIDEO
   */

  const initializeVideo = useCallback(() => {
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
  }, [updateTime, updateFullscreenIcon]);

  return {
    videoContainerRef,
    videoRef,
    videoControlsRef,
    loadingSpinnerRef,
    centerUIRef,
    playButtonRef,
    timeRef,
    currentProgressRef,
    bufferProgressRef,
    seekProgressRef,
    seekTooltipRef,
    volumeButtonRef,
    currentVolumeRef,
    volumeInputRef,
    fullscreenButtonRef,
    errorHandler,
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
    toggleFullscreen,
    initializeVideo,
  };
};
