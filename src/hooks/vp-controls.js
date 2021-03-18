import { useCallback } from "react";

let TIMER;

const playbackAnimate = (element) => {
  element.animate(
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
  // TOGGLE SHOWING CONTROLS
  const hideControls = useCallback((refObject) => {
    const { vidContainerRef, vidRef, vidControlsRef } = refObject;

    if (vidRef.current.paused) {
      return;
    }

    clearTimeout(TIMER);
    TIMER = setTimeout(() => {
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
    const { vidRef, playbackAnimationRef, playButtonRef } = refObject;

    [...playButtonRef.current.children].forEach((icon) =>
      icon.classList.toggle("hidden")
    );
    [...playbackAnimationRef.current.children].forEach((icon) =>
      icon.classList.toggle("hidden")
    );

    if (!vidRef.current.ended) {
      playbackAnimate(playbackAnimationRef.current);
    }
  }, []);

  // TIME CONTROL

  const updateTime = useCallback((refObject) => {
    const { vidRef, currentProgressRef, seekRef, durationRef } = refObject;

    let range = 0;
    const currentTime = vidRef.current.currentTime;
    const buffer = vidRef.current.buffered;

    // Progress UI
    seekRef.current.value = currentTime;
    currentProgressRef.current.style.width =
      (currentTime / vidRef.current.duration) * 100 + "%";

    // Buffer UI
    while (
      !(buffer.start(range) <= currentTime && currentTime <= buffer.end(range))
    ) {
      range += 1;
    }

    // Time UI
    const remainedTime = formatTime(vidRef.current.duration - currentTime);

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

  const skipAhead = useCallback((event, refObject) => {
    const { vidRef, currentProgressRef, seekRef } = refObject;

    const skipTo = event.target.dataset.seek
      ? event.target.dataset.seek
      : event.target.value;

    vidRef.current.currentTime = skipTo;
    seekRef.current.value = skipTo;
    currentProgressRef.current.style.width =
      (skipTo / vidRef.current.duration) * 100 + "%";
  }, []);

  const skipSeconds = useCallback(
    (direction, refObject) => {
      const {
        vidRef,
        seekRef,
        forwardAnimationRef,
        backwardAnimationRef,
      } = refObject;

      seekRef.current.blur();

      switch (direction) {
        case "forward":
          vidRef.current.currentTime += 10;
          [...forwardAnimationRef.current.children].forEach((icon) =>
            icon.classList.toggle("hidden")
          );
          playbackAnimate(forwardAnimationRef.current);
          showControls(refObject);
          break;
        case "backward":
          vidRef.current.currentTime -= 10;
          [...backwardAnimationRef.current.children].forEach((icon) =>
            icon.classList.toggle("hidden")
          );
          playbackAnimate(backwardAnimationRef.current);
          showControls(refObject);
          break;
        default:
          return;
      }
    },
    [showControls]
  );

  // VOLUME CONTROL

  const updateVolume = useCallback((refObject) => {
    const { vidRef, currentVolumeRef, volumeInputRef } = refObject;

    if (vidRef.current.muted) {
      vidRef.current.muted = false;
    }

    vidRef.current.volume = volumeInputRef.current.value;
    currentVolumeRef.current.style.width =
      volumeInputRef.current.value * 100 + "%";
  }, []);

  const updateVolumeWithKey = useCallback((direction, refObject) => {
    const { vidRef, currentVolumeRef, volumeInputRef } = refObject;

    switch (direction) {
      case "up":
        if (vidRef.current.volume + 0.1 > 1) {
          vidRef.current.volume = 1;
        } else {
          vidRef.current.volume += 0.1;
        }
        break;
      case "down":
        if (vidRef.current.volume - 0.1 < 0) {
          vidRef.current.volume = 0;
        } else {
          vidRef.current.volume -= 0.1;
        }
        break;
      default:
        break;
    }

    currentVolumeRef.current.style.width = vidRef.current.volume * 100 + "%";
    volumeInputRef.current.value = vidRef.current.volume;
  }, []);

  const updateVolumeIcon = useCallback((refObject) => {
    const { vidRef, volumeButtonRef } = refObject;

    const video = vidRef.current;
    const volumeIcons = [...volumeButtonRef.current.children];

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
    const { vidRef, volumeInputRef } = refObject;

    vidRef.current.muted = !vidRef.current.muted;

    if (vidRef.current.muted) {
      volumeInputRef.current.setAttribute(
        "data-volume",
        volumeInputRef.current.value
      );
      volumeInputRef.current.value = 0;
    } else {
      volumeInputRef.current.value = volumeInputRef.current.dataset.volume;
    }
  }, []);

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
          skipSeconds("forward", refObject);
          break;
        case "ArrowLeft":
          // Rewind 10 seconds
          skipSeconds("backward", refObject);
          break;
        case "ArrowUp":
          // Volume Up
          updateVolumeWithKey("up", refObject);
          break;
        case "ArrowDown":
          // Volume Down
          updateVolumeWithKey("down", refObject);
          break;

        case " ":
          togglePlay(refObject);
          break;
        default:
          return;
      }
    },
    [skipSeconds, updateVolumeWithKey, togglePlay]
  );

  // INITIALIZE VIDEO

  const initializeVideo = useCallback(
    (refObject, setLoading) => {
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
  };
};
