import {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext,
} from "react";

import { ReactComponent as PlayIcon } from "assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "assets/icons/pause.svg";
import { ReactComponent as VolumeHighIcon } from "assets/icons/volume-high.svg";
import { ReactComponent as VolumeMiddleIcon } from "assets/icons/volume-middle.svg";
import { ReactComponent as VolumeLowIcon } from "assets/icons/volume-low.svg";
import { ReactComponent as VolumeMuteIcon } from "assets/icons/volume-mute.svg";
import { ReactComponent as FullscreenIcon } from "assets/icons/fullscreen.svg";
import { ReactComponent as FullscreenExitIcon } from "assets/icons/fullscreen-exit.svg";
import { VideoContext } from "./VideoTree";
import "./VideoPlayer.css";

const shaka = require("shaka-player/dist/shaka-player.ui.js");

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
  const { videoTreeRef, updateActiveVideo } = useContext(VideoContext);

  // vp-container
  const [displayCursor, setDisplayCursor] = useState("default");

  // vp-controls
  const [canPlayType, setCanPlayType] = useState(true);
  const [displayControls, setDisplayControls] = useState(true);

  // playback button
  const [playbackButton, setPlaybackButton] = useState("play");

  // volume button
  const [volumeButton, setVolumeButton] = useState("high");

  // volume input
  const [currentVolume, setCurrentVolume] = useState("100");
  const [seekVolume, setSeekVolume] = useState(1);

  // progress bar
  const [currentProgress, setCurrentProgress] = useState("0");
  const [bufferProgress, setBufferProgress] = useState("0");
  const [seekProgress, setSeekProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  // seek tooltip
  const [seekTooltip, setSeekTooltip] = useState("00:00");
  const [seekTooltipPosition, setSeekTooltipPosition] = useState("");

  // time ui
  const [displayTime, setdisplayTime] = useState("00:00");

  // fullscreen button
  const [fullscreenButton, setFullscreenButton] = useState("enter");

  // vp-loader
  const [displayLoader, setDisplayLoader] = useState(true);

  // vp-selector
  const [displaySelector, setDisplaySelector] = useState(false);

  const videoRef = useRef();

  const volumeData = useRef();
  const progressSeekData = useRef();

  const controlsTimer = useRef();
  const volumeTimer = useRef();
  const loaderTimer = useRef();

  /*
   * PREVENT DEFAULT
   */

  const eventPreventDefault = (event) => {
    event.preventDefault();
  };

  /*
   * ERROR HANDLER
   */

  const errorHandler = useCallback((event) => {
    // Extract the shaka.util.Error object from the event.
    console.log("Error code", event.detail.code, "object", event.detail);
  }, []);

  /*
   * TOGGLE SHOWING CONTROLS
   */

  const hideControls = useCallback(() => {
    if (videoRef.current.paused) return;

    setDisplayControls(false);
  }, []);

  const showControls = useCallback(() => {
    setDisplayControls(true);
    setDisplayCursor("default");

    if (videoRef.current.paused) return;

    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      hideControls();
      setDisplayCursor("none");
    }, 2000);
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

    showControls();
  }, [showControls]);

  const videoPlayHandler = useCallback(() => {
    setPlaybackButton("pause");
  }, []);

  const videoPauseHandler = useCallback(() => {
    setPlaybackButton("play");
  }, []);

  /*
   * LOADING CONTROL
   */

  const showLoadingSpinner = useCallback(() => {
    loaderTimer.current = setTimeout(() => {
      setDisplayLoader(true);
    }, 300);
  }, []);

  const hideLoadingSpinner = useCallback(() => {
    clearTimeout(loaderTimer.current);
    setDisplayLoader(false);
  }, []);

  /*
   * VOLUME CONTROL
   */

  const controlVolumeByInput = useCallback((event) => {
    videoRef.current.volume = event.target.value;
    setCurrentVolume(event.target.value * 100 + "%");
    setSeekVolume(event.target.value);
  }, []);

  const updateVolume = useCallback(() => {
    const video = videoRef.current;

    setCurrentVolume(video.volume * 100 + "%");
    setSeekVolume(video.volume);

    if (video.volume === 0) {
      video.muted = true;
    } else {
      video.muted = false;
      volumeData.current = video.volume;
    }

    if (video.muted || video.volume === 0) {
      setVolumeButton("mute");
    } else if (video.volume > 0 && video.volume < 0.3) {
      setVolumeButton("low");
    } else if (video.volume >= 0.3 && video.volume < 0.7) {
      setVolumeButton("middle");
    } else {
      setVolumeButton("high");
    }

    clearTimeout(volumeTimer.current);
    volumeTimer.current = setTimeout(() => {
      localStorage.setItem("video-volume", video.volume);
    }, 500);
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current.volume !== 0) {
      volumeData.current = videoRef.current.volume;
      videoRef.current.volume = 0;
      setCurrentVolume("0");
      setSeekVolume(0);
    } else {
      videoRef.current.volume = volumeData.current;
      setSeekVolume(volumeData.current);
      setCurrentVolume(volumeData.current * 100 + "%");
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
    setCurrentProgress((currentTime / duration) * 100 + "%");
    setSeekProgress(currentTime);

    // Buffer UI
    if (duration > 0) {
      for (let i = 0; i < buffer.length; i++) {
        if (
          buffer.start(buffer.length - 1 - i) === 0 ||
          buffer.start(buffer.length - 1 - i) < videoRef.current.currentTime
        ) {
          setBufferProgress(
            (buffer.end(buffer.length - 1 - i) / duration) * 100 + "%"
          );
          break;
        }
      }
    }

    // Time UI
    const remainedTime = formatTime(duration - currentTime);
    setdisplayTime(remainedTime);

    // Show navigation menu if certain time is reached
    if (currentTime / duration > 0.9) {
      setDisplaySelector(true);

      // Hide controls UI & Block show controls on mouse move
    }
  }, []);

  /*
   * SKIP CONTROL
   */

  const updateSeekTooltip = useCallback((event) => {
    const skipTo =
      (event.nativeEvent.offsetX / event.target.clientWidth) *
      parseInt(event.target.getAttribute("max"), 10);

    progressSeekData.current = skipTo;

    let newTime;
    if (skipTo > videoRef.current.duration) {
      newTime = formatTime(videoRef.current.duration);
    } else if (skipTo < 0) {
      newTime = "00:00";
    } else {
      newTime = formatTime(skipTo);
    }

    setSeekTooltip(newTime);

    const rect = videoRef.current.getBoundingClientRect();

    setSeekTooltipPosition(`${event.pageX - rect.left}px`);
  }, []);

  const skipByInput = useCallback((event) => {
    const skipTo = progressSeekData.current
      ? progressSeekData.current
      : event.target.value;

    videoRef.current.currentTime = skipTo;
    setCurrentProgress((skipTo / videoRef.current.duration) * 100 + "%");
    setSeekProgress(skipTo);
  }, []);

  /*
   * FULLSCREEN CONTROL
   */

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoTreeRef.current.requestFullscreen();
    }
  }, [videoTreeRef]);

  const updateFullscreenIcon = useCallback(() => {
    if (document.fullscreenElement) {
      setFullscreenButton("exit");
    } else {
      setFullscreenButton("enter");
    }
  }, []);

  /*
   * KEYBOARD SHORTKUTS
   */

  // const keyboardShortcuts = useCallback(
  //   (event) => {
  //     const { key } = event;

  //     switch (key) {
  //       case "ArrowRight":
  //         // Forward 10 seconds
  //         videoRef.current.currentTime += 10;
  //         break;
  //       case "ArrowLeft":
  //         // Rewind 10 seconds
  //         videoRef.current.currentTime -= 10;
  //         break;
  //       case "ArrowUp":
  //         // Volume Up
  //         if (videoRef.current.volume + 0.05 > 1) {
  //           videoRef.current.volume = 1;
  //         } else {
  //           videoRef.current.volume = (videoRef.current.volume + 0.05).toFixed(
  //             2
  //           );
  //         }
  //         break;
  //       case "ArrowDown":
  //         // Volume Down
  //         if (videoRef.current.volume - 0.05 < 0) {
  //           videoRef.current.volume = 0;
  //         } else {
  //           videoRef.current.volume = (videoRef.current.volume - 0.05).toFixed(
  //             2
  //           );
  //         }
  //         break;
  //       case " ":
  //         togglePlay();
  //         break;
  //       default:
  //         return;
  //     }
  //   },
  //   [togglePlay]
  // );

  /*
   * INITIALIZE VIDEO
   */

  const initializeVideo = useCallback(() => {
    if (!videoRef.current.canPlayType) {
      videoRef.current.controls = true;
      setCanPlayType(false);
    }

    videoRef.current.volume = localStorage.getItem("video-volume") || 1;
    setCurrentVolume(
      localStorage.getItem("video-volume") * 100 + "%" || "100%"
    );

    setVideoDuration(videoRef.current.duration);

    updateTime();

    // document.addEventListener("keyup", keyboardShortcuts);
    document.addEventListener("fullscreenchange", updateFullscreenIcon);
  }, [updateTime, updateFullscreenIcon]);

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

  useLayoutEffect(() => {
    active && videoRef.current.play();
  }, [active]);

  return (
    <div
      className="vp-container"
      onMouseMove={showControls}
      onMouseLeave={hideControls}
      // onContextMenu={eventPreventDefault}
      style={{ display: active ? "" : "none", cursor: displayCursor }}
    >
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        onLoadedMetadata={initializeVideo}
        onClick={togglePlay}
        onPlay={videoPlayHandler}
        onPause={videoPauseHandler}
        onVolumeChange={updateVolume}
        onTimeUpdate={updateTime}
        onDoubleClick={toggleFullscreen}
        onWaiting={showLoadingSpinner}
        onCanPlay={hideLoadingSpinner}
        onError={errorHandler}
      />

      {/* Controls */}

      <div
        className={`vp-controls${!canPlayType ? " hidden" : ""}${
          !displayControls ? " hide" : ""
        }`}
      >
        <div className="vp-controls__playback">
          <div className="vp-controls__btn" onClick={togglePlay}>
            {playbackButton === "play" && <PlayIcon />}
            {playbackButton === "pause" && <PauseIcon />}
          </div>
        </div>

        <div className="vp-controls__volume">
          <div className="vp-controls__btn" onClick={toggleMute}>
            {volumeButton === "high" && <VolumeHighIcon />}
            {volumeButton === "middle" && <VolumeMiddleIcon />}
            {volumeButton === "low" && <VolumeLowIcon />}
            {volumeButton === "mute" && <VolumeMuteIcon />}
          </div>
          <div className="vp-controls__range--outer">
            <div className="vp-controls__range--inner">
              <div className="vp-controls__range--background" />
              <div
                className="vp-controls__range--current"
                style={{ width: currentVolume }}
              />
              <input
                className="vp-controls__range--seek"
                type="range"
                value={seekVolume}
                max="1"
                step="0.05"
                onInput={controlVolumeByInput}
                onKeyDown={eventPreventDefault}
              />
            </div>
          </div>
        </div>

        <div className="vp-controls__progress">
          <div className="vp-controls__range--background" />
          <div
            className="vp-controls__range--buffer"
            style={{ width: bufferProgress }}
          />
          <div
            className="vp-controls__range--current"
            style={{ width: currentProgress }}
          />
          <input
            className="vp-controls__range--seek"
            type="range"
            step="0.1"
            max={videoDuration}
            value={seekProgress}
            onMouseMove={updateSeekTooltip}
            onInput={skipByInput}
            onKeyDown={eventPreventDefault}
          />
          <span
            className="vp-controls__range--seek-tooltip"
            style={{ left: seekTooltipPosition }}
          >
            {seekTooltip}
          </span>
        </div>

        <div className="vp-controls__time">
          <time dateTime={displayTime}>{displayTime}</time>
        </div>

        <div className="vp-controls__btn" onClick={toggleFullscreen}>
          {fullscreenButton === "enter" && <FullscreenIcon />}
          {fullscreenButton === "exit" && <FullscreenExitIcon />}
        </div>
      </div>

      {/* Loader */}

      <div className={`vp-loader__container${!displayLoader ? " hidden" : ""}`}>
        <div className="vp-loader" />
      </div>

      {/* Selector */}

      <div
        className={`vp-selector__container${displaySelector ? " active" : ""}`}
      >
        {next.map((video) => (
          <div
            key={video.info.optionTitle}
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
