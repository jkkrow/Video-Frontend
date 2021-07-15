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
import IconButton from "components/UI/IconButton";
import LoadingSpinner from "components/UI/Loader/LoadingSpinner";
import { VideoContext } from "context/video-context";
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

const VideoPlayer = ({ src, next, autoPlay, active, previousVideo }) => {
  const {
    tree,
    activeVideo,
    videoTreeRef,
    videoVolume,
    editMode,
    updateActiveVideo,
    updateVideoVolume,
  } = useContext(VideoContext);

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
  const videoContainerRef = useRef();
  const videoSelectorRef = useRef();

  const volumeData = useRef();
  const progressSeekData = useRef();

  const controlsTimer = useRef();
  const volumeTimer = useRef();
  const loaderTimer = useRef();

  /*
   * PREVENT DEFAULT
   */

  const eventPreventDefault = useCallback((event) => {
    event.preventDefault();
  }, []);

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

  const hideControlsHandler = useCallback(() => {
    if (videoRef.current.paused) return;

    setDisplayControls(false);
  }, []);

  const showControlsHandler = useCallback(() => {
    setDisplayControls(true);
    setDisplayCursor("default");

    if (videoRef.current.paused) return;

    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      hideControlsHandler();
      setDisplayCursor("none");
    }, 2000);
  }, [hideControlsHandler]);

  /*
   * PLAYBACK CONTROL
   */

  const togglePlayHandler = useCallback(() => {
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }

    showControlsHandler();
  }, [showControlsHandler]);

  const videoPlayHandler = useCallback(() => {
    setPlaybackButton("pause");
  }, []);

  const videoPauseHandler = useCallback(() => {
    setPlaybackButton("play");
  }, []);

  /*
   * LOADING CONTROL
   */

  const showLoaderHandler = useCallback(() => {
    loaderTimer.current = setTimeout(() => {
      setDisplayLoader(true);
    }, 300);
  }, []);

  const hideLoaderHandler = useCallback(() => {
    clearTimeout(loaderTimer.current);
    setDisplayLoader(false);
  }, []);

  /*
   * VOLUME CONTROL
   */

  const volumeInputChangeHandler = useCallback((event) => {
    videoRef.current.volume = event.target.value;
    setCurrentVolume(event.target.value * 100 + "%");
    setSeekVolume(event.target.value);
  }, []);

  const volumeChangeHandler = useCallback(() => {
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

    if (active) {
      updateVideoVolume(video.volume);

      clearTimeout(volumeTimer.current);
      volumeTimer.current = setTimeout(() => {
        localStorage.setItem("video-volume", video.volume);
      }, 500);
    }
  }, [active, updateVideoVolume]);

  const toggleMuteHandler = useCallback(() => {
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

  const timeChangeHandler = useCallback(() => {
    const duration = videoRef.current.duration || 0;
    const currentTime = videoRef.current.currentTime || 0;
    const buffer = videoRef.current.buffered;

    // Progress
    setCurrentProgress((currentTime / duration) * 100 + "%");
    setSeekProgress(currentTime);

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

    // Time
    const remainedTime = formatTime(duration - currentTime);
    setdisplayTime(remainedTime);

    // Selector
    if (currentTime / duration >= 0.9) {
      setDisplaySelector(true);
    } else {
      setDisplaySelector(false);
    }
  }, []);

  /*
   * SKIP CONTROL
   */

  const seekMouseMoveHandler = useCallback((event) => {
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

  const seekChangeHandler = useCallback((event) => {
    const skipTo = progressSeekData.current || event.target.value;

    videoRef.current.currentTime = skipTo;
    setCurrentProgress((skipTo / videoRef.current.duration) * 100 + "%");
    setSeekProgress(skipTo);
  }, []);

  /*
   * FULLSCREEN CONTROL
   */

  const toggleFullscreenHandler = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoTreeRef.current.requestFullscreen();
    }
  }, [videoTreeRef]);

  const fullscreenChangeHandler = useCallback(() => {
    if (document.fullscreenElement) {
      setFullscreenButton("exit");
    } else {
      setFullscreenButton("enter");
    }
  }, []);

  /*
   * KEYBOARD SHORTKUTS
   */

  const keyEventHandler = useCallback(
    (event) => {
      const { key } = event;

      switch (key) {
        case "ArrowRight":
          // Forward 10 seconds
          videoRef.current.currentTime += 10;
          break;
        case "ArrowLeft":
          // Rewind 10 seconds
          videoRef.current.currentTime -= 10;
          break;
        case "ArrowUp":
          // Volume Up
          if (videoRef.current.volume + 0.05 > 1) {
            videoRef.current.volume = 1;
          } else {
            videoRef.current.volume = (videoRef.current.volume + 0.05).toFixed(
              2
            );
          }
          break;
        case "ArrowDown":
          // Volume Down
          if (videoRef.current.volume - 0.05 < 0) {
            videoRef.current.volume = 0;
          } else {
            videoRef.current.volume = (videoRef.current.volume - 0.05).toFixed(
              2
            );
          }
          break;
        case " ":
          togglePlayHandler();
          break;

        case "1":
          if (!displaySelector) return;
          videoSelectorRef.current.children[0]?.click();
          break;
        case "2":
          if (!displaySelector) return;
          videoSelectorRef.current.children[1]?.click();
          break;
        case "3":
          if (!displaySelector) return;
          videoSelectorRef.current.children[2]?.click();
          break;
        case "4":
          if (!displaySelector) return;
          videoSelectorRef.current.children[3]?.click();
          break;
        default:
          return;
      }
    },
    [displaySelector, togglePlayHandler]
  );

  /*
   * INITIALIZE VIDEO
   */

  const videoLoadHandler = useCallback(() => {
    if (!videoRef.current.canPlayType) {
      videoRef.current.controls = true;
      setCanPlayType(false);
    }

    videoRef.current.volume = localStorage.getItem("video-volume") || 1;
    setCurrentVolume(
      localStorage.getItem("video-volume") * 100 + "%" || "100%"
    );

    setVideoDuration(videoRef.current.duration);

    timeChangeHandler();

    document.addEventListener("fullscreenchange", fullscreenChangeHandler);
  }, [timeChangeHandler, fullscreenChangeHandler]);

  /*
   * NAVIGATION
   */

  const restartVideoTree = useCallback(() => {
    updateActiveVideo(tree.root);
  }, [tree.root, updateActiveVideo]);

  const navigateToPreviousVideo = useCallback(() => {
    updateActiveVideo(previousVideo);
  }, [updateActiveVideo, previousVideo]);

  const navigateToSelectorTimeline = useCallback(() => {
    videoRef.current.currentTime = videoRef.current.duration * 0.9;
    videoRef.current.play();
  }, []);

  /*
   * USEEFFECT
   */

  useEffect(() => {
    return () => {
      clearTimeout(controlsTimer.current);
      clearTimeout(volumeTimer.current);
      clearTimeout(loaderTimer.current);
    };
  }, []);

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

  useEffect(() => {
    if (!active) {
      videoRef.current.volume = videoVolume;
      setDisplayControls(false);
    }
  }, [active, videoVolume]);

  useEffect(() => {
    if (active) {
      videoContainerRef.current.focus();
    }

    if (!active) {
      videoContainerRef.current.blur();
    }
  }, [active]);

  useEffect(() => {
    if (displaySelector) {
    }
  }, [displaySelector]);

  useLayoutEffect(() => {
    if (active) {
      videoRef.current.play();
      setDisplayCursor("none");
    }

    if (!active) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [active]);

  /*
   * RENDER
   */

  return (
    <div
      className="vp-container"
      ref={videoContainerRef}
      style={{ display: active ? "" : "none", cursor: displayCursor }}
      tabIndex={-1}
      onMouseMove={showControlsHandler}
      onMouseLeave={hideControlsHandler}
      onKeyDown={keyEventHandler}
      // onContextMenu={eventPreventDefault}
    >
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        onLoadedMetadata={videoLoadHandler}
        onClick={togglePlayHandler}
        onPlay={videoPlayHandler}
        onPause={videoPauseHandler}
        onVolumeChange={volumeChangeHandler}
        onTimeUpdate={timeChangeHandler}
        onDoubleClick={toggleFullscreenHandler}
        onWaiting={showLoaderHandler}
        onCanPlay={hideLoaderHandler}
        onError={errorHandler}
      />

      {/* Controls */}

      <div
        className={`vp-controls${!canPlayType ? " hidden" : ""}${
          !displayControls ? " hide" : ""
        }`}
      >
        <div className="vp-controls__playback">
          <button className="vp-controls__btn" onClick={togglePlayHandler}>
            {playbackButton === "play" && <PlayIcon />}
            {playbackButton === "pause" && <PauseIcon />}
          </button>
        </div>

        <div className="vp-controls__volume">
          <button className="vp-controls__btn" onClick={toggleMuteHandler}>
            {volumeButton === "high" && <VolumeHighIcon />}
            {volumeButton === "middle" && <VolumeMiddleIcon />}
            {volumeButton === "low" && <VolumeLowIcon />}
            {volumeButton === "mute" && <VolumeMuteIcon />}
          </button>
          <div className="vp-controls__volume-range--outer">
            <div className="vp-controls__volume-range--inner">
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
                onChange={volumeInputChangeHandler}
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
            onMouseMove={seekMouseMoveHandler}
            onChange={seekChangeHandler}
            onKeyDown={eventPreventDefault}
          />
          <span
            className="vp-controls__range--seek-tooltip"
            style={{ left: seekTooltipPosition }}
          >
            {seekTooltip}
          </span>
        </div>

        <time className="vp-controls__time" dateTime={displayTime}>
          {displayTime}
        </time>

        <div
          className="vp-controls__fullscreen"
          onClick={toggleFullscreenHandler}
        >
          <button className="vp-controls__btn">
            {fullscreenButton === "enter" && <FullscreenIcon />}
            {fullscreenButton === "exit" && <FullscreenExitIcon />}
          </button>
        </div>
      </div>

      {/* Loader */}

      <LoadingSpinner on={displayLoader} />

      {/* Selector */}

      <div
        className={`vp-selector__container${displaySelector ? " active" : ""}${
          displayControls ? " high" : ""
        }`}
        ref={videoSelectorRef}
      >
        {next.map((video) => (
          <button
            key={video.info.optionTitle}
            className="vp-selector"
            onClick={() => updateActiveVideo(video)}
          >
            {video.info.optionTitle}
          </button>
        ))}
      </div>

      {/* Navigation ( Edit Mode ) */}
      {editMode && (
        <div className="vp-navigation">
          {activeVideo !== tree.root && (
            <IconButton
              className="double-left-angle"
              onClick={restartVideoTree}
            />
          )}
          {activeVideo !== tree.root && (
            <IconButton
              className="left-angle"
              onClick={navigateToPreviousVideo}
            />
          )}
          <IconButton
            className="right-angle"
            onClick={navigateToSelectorTimeline}
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
