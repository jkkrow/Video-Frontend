import { useState, useCallback } from "react";

let TIMER;

export const useVideoPlayerControls = () => {
  const [loaded, setLoaded] = useState(false);

  // TOGGLE SHOWING CONTROLS
  const hideControls = useCallback((vidRef, vidControlsRef) => {
    if (vidRef.current.paused) {
      return;
    }

    vidControlsRef.current.classList.add("hide");
  }, []);

  const showControls = useCallback(
    (vidContainerRef, vidRef, vidControlsRef) => {
      vidControlsRef.current.classList.remove("hide");
      vidContainerRef.current.style.cursor = "default";

      clearTimeout(TIMER);
      TIMER = setTimeout(() => {
        hideControls(vidRef, vidControlsRef);
        if (!vidRef.current.paused)
          vidContainerRef.current.style.cursor = "none";
      }, [1500]);
    },
    [hideControls]
  );

  // PLAYBACK ANIMATION

  const playbackAnimate = useCallback((element) => {
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
      { duration: 500 }
    );
  }, []);

  // PLAYBACK CONTROL

  const togglePlay = useCallback(
    (vidContainerRef, vidRef, vidControlsRef) => {
      if (vidRef.current.paused || vidRef.current.ended) {
        vidRef.current.play();
      } else {
        vidRef.current.pause();
      }

      showControls(vidContainerRef, vidRef, vidControlsRef);
    },
    [showControls]
  );

  const updatePlaybackIcon = useCallback(
    (vidRef, playbackAnimationRef, playButtonRef) => {
      [...playButtonRef.current.children].forEach((icon) =>
        icon.classList.toggle("hidden")
      );
      [...playbackAnimationRef.current.children].forEach((icon) =>
        icon.classList.toggle("hidden")
      );

      if (!vidRef.current.ended) {
        playbackAnimate(playbackAnimationRef.current);
      }
    },
    [playbackAnimate]
  );

  // TIME CONTROL

  const formatTime = useCallback((timeInSeconds) => {
    const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
    // if duration is over hour
    if (Number(result.substr(0, 2)) > 0) {
      // show 00:00:00
      return result;
    } else {
      // else show 00:00
      return result.substr(3);
    }
  }, []);

  const updateTime = useCallback(
    (vidRef, progressBarRef, seekRef, timeElapsedRef, durationRef) => {
      const currentVideoTime = vidRef.current.currentTime;
      // Progress UI
      seekRef.current.value = currentVideoTime;
      progressBarRef.current.value = currentVideoTime;

      // Time UI
      const currentTime = formatTime(currentVideoTime);
      const remainedTime = formatTime(
        Math.ceil(vidRef.current.duration) - currentVideoTime
      );

      timeElapsedRef.current.innerText = currentTime;
      timeElapsedRef.current.setAttribute("datetime", currentTime);
      durationRef.current.innerText = remainedTime;
      durationRef.current.setAttribute("datetime", remainedTime);
    },
    [formatTime]
  );

  // SKIP CONTROL

  const updateSeekTooltip = useCallback(
    (event, vidRef, seekRef, seekTooltipRef) => {
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
    },
    [formatTime]
  );

  const skipAhead = useCallback((event, vidRef, progressBarRef, seekRef) => {
    const skipTo = event.target.dataset.seek
      ? event.target.dataset.seek
      : event.target.value;

    vidRef.current.currentTime = skipTo;
    progressBarRef.current.value = skipTo;
    seekRef.current.value = skipTo;
  }, []);

  const skipSeconds = useCallback(
    (direction, vidRef, seekRef, forwardAnimationRef, backwardAnimationRef) => {
      seekRef.current.blur();

      switch (direction) {
        case "forward":
          vidRef.current.currentTime += 10;
          [...forwardAnimationRef.current.children].forEach((icon) =>
            icon.classList.toggle("hidden")
          );
          playbackAnimate(forwardAnimationRef.current);
          break;
        case "backward":
          vidRef.current.currentTime -= 10;
          [...backwardAnimationRef.current.children].forEach((icon) =>
            icon.classList.toggle("hidden")
          );
          playbackAnimate(backwardAnimationRef.current);
          break;
        default:
          return;
      }
    },
    [playbackAnimate]
  );

  // VOLUME CONTROL

  const updateVolume = useCallback((vidRef, volumeInputRef) => {
    if (vidRef.current.muted) {
      vidRef.current.muted = false;
    }

    vidRef.current.volume = volumeInputRef.current.value;
  }, []);

  const updateVolumeIcon = useCallback((vidRef, volumeButtonRef) => {
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

  const toggleMute = useCallback((vidRef, volumeInputRef) => {
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

  const toggleFullScreen = useCallback((vidContainerRef) => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      vidContainerRef.current.requestFullscreen();
    }
  }, []);

  const updateFullscreenIcon = useCallback((fullScreenButtonRef) => {
    const btn = fullScreenButtonRef.current;

    [...btn.children].forEach((icon) => icon.classList.toggle("hidden"));
  }, []);

  // KEYBOARD SHORTKUTS

  const keyboardShortcuts = useCallback(
    (
      event,
      vidContainerRef,
      vidRef,
      vidControlsRef,
      seekRef,
      volumeInputRef,
      forwardAnimationRef,
      backwardAnimationRef
    ) => {
      const { key } = event;

      switch (key) {
        case "ArrowRight":
          // Forward 10 seconds
          skipSeconds(
            "forward",
            vidRef,
            seekRef,
            forwardAnimationRef,
            backwardAnimationRef
          );
          break;
        case "ArrowLeft":
          // Rewind 10 seconds
          skipSeconds(
            "backward",
            vidRef,
            seekRef,
            forwardAnimationRef,
            backwardAnimationRef
          );
          break;
        case "ArrowUp":
          // Volume Up
          if (vidRef.current.volume + 0.1 > 1) {
            vidRef.current.volume = 1;
          } else {
            vidRef.current.volume += 0.1;
          }
          volumeInputRef.current.value = vidRef.current.volume;
          break;
        case "ArrowDown":
          // Volume Down
          if (vidRef.current.volume - 0.1 < 0) {
            vidRef.current.volume = 0;
          } else {
            vidRef.current.volume -= 0.1;
          }
          volumeInputRef.current.value = vidRef.current.volume;
          break;

        case " ":
          togglePlay(vidContainerRef, vidRef, vidControlsRef);
          break;
        default:
          return;
      }
    },
    [skipSeconds, togglePlay]
  );

  // INITIALIZE VIDEO

  const initializeVideo = useCallback(
    (
      vidContainerRef,
      vidRef,
      vidControlsRef,
      progressBarRef,
      seekRef,
      durationRef,
      volumeInputRef,
      forwardAnimationRef,
      backwardAnimationRef,
      fullScreenButtonRef
    ) => {
      if (!vidRef.current.canPlayType) {
        vidRef.current.controls = true;
        vidControlsRef.current.classList.add("hidden");
      }

      const videoDuration = vidRef.current.duration;
      seekRef.current.setAttribute("max", videoDuration);
      progressBarRef.current.setAttribute("max", videoDuration);

      const result = formatTime(videoDuration);
      durationRef.current.innerText = result;
      durationRef.current.setAttribute("datetime", result);

      document.addEventListener("keyup", (event) =>
        keyboardShortcuts(
          event,
          vidContainerRef,
          vidRef,
          vidControlsRef,
          seekRef,
          volumeInputRef,
          forwardAnimationRef,
          backwardAnimationRef
        )
      );
      setLoaded(true);

      document.addEventListener("fullscreenchange", () =>
        updateFullscreenIcon(fullScreenButtonRef)
      );
    },
    [formatTime, keyboardShortcuts, updateFullscreenIcon]
  );

  return {
    loaded,
    setLoaded,
    hideControls,
    showControls,
    playbackAnimate,
    togglePlay,
    updatePlaybackIcon,
    formatTime,
    updateTime,
    updateSeekTooltip,
    skipAhead,
    skipSeconds,
    updateVolume,
    updateVolumeIcon,
    toggleMute,
    toggleFullScreen,
    updateFullscreenIcon,
    keyboardShortcuts,
    initializeVideo,
  };
};
