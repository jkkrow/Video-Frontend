import React, { useRef, useEffect } from "react";

import { ReactComponent as PlayIcon } from "../../assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "../../assets/icons/pause.svg";
import { ReactComponent as VolumeHighIcon } from "../../assets/icons/volume-high.svg";
import { ReactComponent as VolumeLowIcon } from "../../assets/icons/volume-low.svg";
import { ReactComponent as VolumeMuteIcon } from "../../assets/icons/volume-mute.svg";
import { ReactComponent as FullscreenIcon } from "../../assets/icons/fullscreen.svg";
import { ReactComponent as FullscreenExitIcon } from "../../assets/icons/fullscreen-exit.svg";
import "./Video.css";

const Video = (props) => {
  const vidContainerRef = useRef();
  const vidRef = useRef();
  const playbackAnimationRef = useRef();
  const vidControlsRef = useRef();
  const playButtonRef = useRef();
  const timeElapsedRef = useRef();
  const durationRef = useRef();
  const progressBarRef = useRef();
  const seekRef = useRef();
  const seekTooltipRef = useRef();
  const volumeButtonRef = useRef();
  const volumeInputRef = useRef();
  const fullScreenButtonRef = useRef();

  useEffect(() => {
    if (!vidRef.current.canPlayType) {
      vidRef.current.controls = true;
      vidControlsRef.current.classList.add("hidden");
    }
  }, []);

  // **PLAYBACK CONTROL

  const togglePlay = () => {
    if (vidRef.current.paused || vidRef.current.ended) {
      vidRef.current.play();
    } else {
      vidRef.current.pause();
    }

    [...playbackAnimationRef.current.children].forEach((icon) =>
      icon.classList.toggle("hidden")
    );

    playbackAnimationRef.current.animate(
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
  };

  const updatePlayButton = () => {
    [...playButtonRef.current.children].forEach((icon) =>
      icon.classList.toggle("hidden")
    );

    if (vidRef.current.paused) {
      playButtonRef.current.setAttribute("data-title", "Play (k)");
    } else {
      playButtonRef.current.setAttribute("data-title", "Pause (k)");
    }
  };

  // **TIME CONTROL

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

  const initializeVideo = () => {
    const videoDuration = vidRef.current.duration;
    seekRef.current.setAttribute("max", videoDuration);
    progressBarRef.current.setAttribute("max", videoDuration);

    const result = formatTime(videoDuration);
    durationRef.current.innerText = result;
    durationRef.current.setAttribute("datetime", result);
  };

  const updateTime = () => {
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
  };

  // **SKIP CONTROL

  const updateSeekTooltip = (event) => {
    const skipTo = Math.round(
      (event.nativeEvent.offsetX / event.target.clientWidth) *
        parseInt(event.target.getAttribute("max"), 10)
    );
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

  const skipAhead = (event) => {
    const skipTo = event.target.dataset.seek
      ? event.target.dataset.seek
      : event.target.value;

    vidRef.current.currentTime = skipTo;
    progressBarRef.current.value = skipTo;
    seekRef.current.value = skipTo;
  };

  // **VOLUME CONTROL

  const updateVolume = () => {
    if (vidRef.current.muted) {
      vidRef.current.muted = false;
    }

    vidRef.current.volume = volumeInputRef.current.value;
  };

  const updateVolumeIcon = () => {
    const video = vidRef.current;
    const volumeIcons = [...volumeButtonRef.current.children];

    volumeIcons.forEach((icon) => {
      icon.classList.add("hidden");
    });
    volumeButtonRef.current.setAttribute("data-title", "Mute (m)");

    if (video.muted || video.volume === 0) {
      volumeIcons[2].classList.remove("hidden");
      volumeButtonRef.current.setAttribute("data-title", "Unmute (m)");
    } else if (video.volume > 0 && video.volume < 0.5) {
      volumeIcons[1].classList.remove("hidden");
    } else {
      volumeIcons[0].classList.remove("hidden");
    }
  };

  const toggleMute = () => {
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
  };

  // **FULLSCREEN CONTROL

  const toggleFullScreen = () => {
    const btn = fullScreenButtonRef.current;

    [...btn.children].forEach((icon) => icon.classList.toggle("hidden"));

    if (document.fullscreenElement) {
      document.exitFullscreen();
      btn.setAttribute("data-title", "Full screen (f)");
    } else if (document.webkitFullscreenElement) {
      // For Safari
      document.webkitExitFullscreen();
      btn.setAttribute("data-title", "Full screen (f)");
    } else if (vidContainerRef.current.webkitRequestFullscreen) {
      // For Safari
      vidContainerRef.current.webkitRequestFullscreen();
      btn.setAttribute("data-title", "Exit full screen (f)");
    } else {
      vidContainerRef.current.requestFullscreen();
      btn.setAttribute("data-title", "Exit full screen (f)");
    }
  };

  // **TOGGLE SHOWING CONTROLS

  const hideControls = () => {
    if (vidRef.current.paused) {
      return;
    }

    vidControlsRef.current.classList.add("hide");
  };

  const showControls = () => {
    vidControlsRef.current.classList.remove("hide");
  };

  // **KEYBOARD SHORTKUTS

  const keyboardShortcuts = (event) => {
    const { key } = event;

    switch (key) {
      case "ArrowRight":
        // Skip 5 seconds
        vidRef.current.currentTime += 5;
        break;
      case "ArrowLeft":
        // Rewind 5 seconds
        vidRef.current.currentTime -= 5;
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
      case "k":
        togglePlay();
        if (vidRef.current.paused) {
          showControls();
        } else {
          setTimeout(() => {
            hideControls();
          }, 2000);
        }
        break;
      case "m":
        toggleMute();
        break;
      case "f":
        toggleFullScreen();
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    document.addEventListener("keyup", keyboardShortcuts);
  });

  return (
    <div ref={vidContainerRef} className="video-container">
      <video
        ref={vidRef}
        id={props.id}
        onContextMenu={(e) => e.preventDefault()}
        poster={props.poster}
        onClick={togglePlay}
        onPlay={updatePlayButton}
        onPause={updatePlayButton}
        onLoadedMetadata={initializeVideo}
        onTimeUpdate={updateTime}
        onVolumeChange={updateVolumeIcon}
        onMouseEnter={showControls}
        onMouseLeave={hideControls}
      >
        <source src={props.src} type={props.type} />
      </video>

      <div ref={playbackAnimationRef} className="playback-animation">
        <PlayIcon className="hidden" />
        <PauseIcon />
      </div>

      <div
        className="video-controls"
        ref={vidControlsRef}
        onMouseEnter={showControls}
        onMouseLeave={hideControls}
      >
        <div className="video-controls__progress">
          <progress ref={progressBarRef} min="0"></progress>
          <input
            ref={seekRef}
            defaultValue="0"
            className="seek"
            min="0"
            type="range"
            step="1"
            onMouseMove={updateSeekTooltip}
            onInput={skipAhead}
          />
          <div ref={seekTooltipRef} className="seek-tooltip">
            00:00
          </div>
        </div>

        <div className="video-controls__bottom">
          <div className="video-controls__bottom--left">
            <div className="video-controls__playback">
              <button
                ref={playButtonRef}
                data-title="Play (K)"
                onClick={togglePlay}
              >
                <PlayIcon />
                <PauseIcon className="hidden" />
              </button>
            </div>

            <div className="video-controls__volume">
              <button
                ref={volumeButtonRef}
                onClick={toggleMute}
                data-title="Mute (m)"
                className="volume-button"
              >
                <VolumeHighIcon />
                <VolumeLowIcon className="hidden" />
                <VolumeMuteIcon className="hidden" />
              </button>
              <input
                ref={volumeInputRef}
                onInput={updateVolume}
                className="volume"
                type="range"
                max="1"
                min="0"
                step="0.01"
              />
            </div>

            <div className="video-controls__time">
              <time ref={timeElapsedRef}>00:00</time>
              <span> / </span>
              <time ref={durationRef}>00:00</time>
            </div>

            <div className="video-controls__bottom--right">
              <button
                ref={fullScreenButtonRef}
                onClick={toggleFullScreen}
                data-title="Full screen (f)"
                className="fullscreen-button"
                id="fullscreen-button"
              >
                <FullscreenIcon />
                <FullscreenExitIcon className="hidden" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
