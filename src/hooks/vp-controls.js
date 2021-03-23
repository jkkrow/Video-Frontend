import { useState, useCallback } from "react";

let CONTROLSTIMER, BUFFERTIMER;

const centerDisplayAnimate = (element) => {
  [...element.current.children].forEach((icon) =>
    icon.classList.toggle("hidden")
  );

  element.current.animate(
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
    { duration: 700 }
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

export const useVideoPlayerControls = () => {
  const [loading, setLoading] = useState(true);

  // TOGGLE SHOWING CONTROLS
  const hideControls = useCallback((refObject) => {
    const { vidContainerRef, vidRef, vidControlsRef } = refObject;

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
  }, []);

  const showControls = useCallback(
    (refObject) => {
      const { vidContainerRef, vidControlsRef } = refObject;

      vidControlsRef.current.classList.remove("hide");
      vidContainerRef.current.style.cursor = "default";

      hideControls(refObject);
    },
    [hideControls]
  );

  // PLAYBACK CONTROL

  const togglePlay = useCallback(
    (refObject) => {
      const { vidRef } = refObject;

      if (vidRef.current.paused || vidRef.current.ended) {
        vidRef.current.play();
      } else {
        vidRef.current.pause();
      }

      showControls(refObject);
    },
    [showControls]
  );

  const updatePlaybackIcon = useCallback((refObject) => {
    const { vidRef, playbackDisplayRef, playButtonRef } = refObject;

    [...playButtonRef.current.children].forEach((icon) =>
      icon.classList.toggle("hidden")
    );

    if (!vidRef.current.ended) {
      centerDisplayAnimate(playbackDisplayRef);
    } else {
      [...playbackDisplayRef.current.children].forEach((icon) =>
        icon.classList.toggle("hidden")
      );
    }
  }, []);

  // LOADING CONTROL

  const videoBufferStart = () => {
    BUFFERTIMER = setTimeout(() => {
      setLoading(true);
    }, 500);
  };

  const videoBufferFinish = () => {
    clearTimeout(BUFFERTIMER);
    setLoading(false);
  };

  // VOLUME CONTROL

  const controlVolumeByInput = useCallback((refObject) => {
    const { vidRef, currentVolumeRef, volumeInputRef } = refObject;

    vidRef.current.volume = volumeInputRef.current.value;
    currentVolumeRef.current.style.width =
      volumeInputRef.current.value * 100 + "%";
  }, []);

  const controlVolumeByKey = useCallback((direction, refObject) => {
    const {
      vidRef,
      volumeUpDisplayRef,
      volumeDownDisplayRef,
      currentVolumeRef,
      volumeInputRef,
    } = refObject;

    volumeInputRef.current.blur();

    switch (direction) {
      case "up":
        if (vidRef.current.volume + 0.05 > 1) {
          vidRef.current.volume = 1;
        } else {
          vidRef.current.volume = (vidRef.current.volume + 0.05).toFixed(2);
        }
        centerDisplayAnimate(volumeUpDisplayRef);
        break;
      case "down":
        if (vidRef.current.volume - 0.05 < 0) {
          vidRef.current.volume = 0;
        } else {
          vidRef.current.volume = (vidRef.current.volume - 0.05).toFixed(2);
        }
        centerDisplayAnimate(volumeDownDisplayRef);
        break;
      default:
        break;
    }

    currentVolumeRef.current.style.width = vidRef.current.volume * 100 + "%";
    volumeInputRef.current.value = vidRef.current.volume;
  }, []);

  const updateVolume = useCallback((refObject) => {
    const { vidRef, volumeButtonRef, volumeInputRef } = refObject;

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
      volumeIcons[2].classList.remove("hidden");
    } else if (video.volume > 0 && video.volume < 0.5) {
      volumeIcons[1].classList.remove("hidden");
    } else {
      volumeIcons[0].classList.remove("hidden");
    }
  }, []);

  const toggleMute = useCallback((refObject) => {
    const { vidRef, currentVolumeRef, volumeInputRef } = refObject;

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
  }, []);

  // TIME CONTROL

  const updateTime = useCallback((refObject) => {
    const {
      vidRef,
      bufferProgressRef,
      currentProgressRef,
      seekRef,
      durationRef,
    } = refObject;

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
  }, []);

  // SKIP CONTROL

  const updateSeekTooltip = useCallback((event, refObject) => {
    const { vidRef, seekRef, seekTooltipRef } = refObject;

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
  }, []);

  const skipByInput = useCallback((event, refObject) => {
    const { vidRef, currentProgressRef, seekRef } = refObject;

    event.preventDefault();

    const skipTo = event.target.dataset.seek
      ? event.target.dataset.seek
      : event.target.value;

    vidRef.current.currentTime = skipTo;
    seekRef.current.value = skipTo;
    currentProgressRef.current.style.width =
      (skipTo / vidRef.current.duration) * 100 + "%";
  }, []);

  const skipByKey = useCallback(
    (direction, refObject) => {
      const {
        vidRef,
        seekRef,
        forwardDisplayRef,
        backwardDisplayRef,
      } = refObject;

      seekRef.current.blur();

      switch (direction) {
        case "forward":
          vidRef.current.currentTime += 10;
          centerDisplayAnimate(forwardDisplayRef);
          break;
        case "backward":
          vidRef.current.currentTime -= 10;
          centerDisplayAnimate(backwardDisplayRef);
          break;
        default:
          return;
      }

      showControls(refObject);
    },
    [showControls]
  );

  // FULLSCREEN CONTROL

  const toggleFullScreen = useCallback((refObject) => {
    const { vidContainerRef } = refObject;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      vidContainerRef.current.requestFullscreen();
    }
  }, []);

  const updateFullscreenIcon = useCallback((refObject) => {
    const { fullScreenButtonRef } = refObject;

    const btn = fullScreenButtonRef.current;

    [...btn.children].forEach((icon) => icon.classList.toggle("hidden"));
  }, []);

  // KEYBOARD SHORTKUTS

  const keyboardShortcuts = useCallback(
    (event, refObject) => {
      const { key } = event;

      switch (key) {
        case "ArrowRight":
          // Forward 10 seconds
          skipByKey("forward", refObject);
          break;
        case "ArrowLeft":
          // Rewind 10 seconds
          skipByKey("backward", refObject);
          break;
        case "ArrowUp":
          // Volume Up
          controlVolumeByKey("up", refObject);
          break;
        case "ArrowDown":
          // Volume Down
          controlVolumeByKey("down", refObject);
          break;

        case " ":
          togglePlay(refObject);
          break;
        default:
          return;
      }
    },
    [skipByKey, controlVolumeByKey, togglePlay]
  );

  // INITIALIZE VIDEO

  const initializeVideo = useCallback(
    (refObject) => {
      const {
        vidRef,
        vidControlsRef,
        currentProgressRef,
        seekRef,
        durationRef,
      } = refObject;

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

      document.addEventListener("keyup", (event) =>
        keyboardShortcuts(event, refObject)
      );
      setLoading(false);

      document.addEventListener("fullscreenchange", () =>
        updateFullscreenIcon(refObject)
      );
    },
    [keyboardShortcuts, updateFullscreenIcon]
  );

  return {
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
  };
};
