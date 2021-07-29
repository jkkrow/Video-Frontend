import {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import Playback from "./Controls/Playback";
import Volume from "./Controls/Volume";
import Progress from "./Controls/Progress";
import Time from "./Controls/Time";
import Fullscreen from "./Controls/Fullscreen";
import Selector from "./Controls/Selector";
import Navigation from "./Controls/Navigation";
import Loader from "./Controls/Loader";
import {
  updateActiveVideo,
  selectNextVideo,
  updateVideoVolume,
} from "store/actions/video";
import { formatTime } from "util/format";
import "./VideoPlayer.css";

const shaka = require("shaka-player/dist/shaka-player.ui.js");

const VideoPlayer = ({
  currentVideo,
  autoPlay,
  editMode,
  active,
  previousVideo,
}) => {
  const dispatch = useDispatch();

  const { videoTree, activeVideo, videoVolume } = useSelector(
    (state) => state.video
  );

  // vp-container
  const [displayCursor, setDisplayCursor] = useState("default");

  // vp-controls
  const [canPlayType, setCanPlayType] = useState(true);
  const [displayControls, setDisplayControls] = useState(true);

  // playback button
  const [playbackState, setPlaybackState] = useState("play");

  // volume button
  const [volumeState, setVolumeState] = useState("high");

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
  const [fullscreen, setFullscreen] = useState(false);

  // vp-loader
  const [displayLoader, setDisplayLoader] = useState(true);

  // vp-selector
  const [displaySelector, setDisplaySelector] = useState(false);
  const [selectedNext, setSelectedNext] = useState(false);

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

  const preventDefault = useCallback((event) => {
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
    setPlaybackState("pause");
  }, []);

  const videoPauseHandler = useCallback(() => {
    setPlaybackState("play");
  }, []);

  const videoEndedHandler = useCallback(() => {
    currentVideo.children.length > 0 &&
      dispatch(updateActiveVideo(currentVideo.children[0]));
  }, [dispatch, currentVideo.children]);

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
      setVolumeState("mute");
    } else if (video.volume > 0 && video.volume < 0.3) {
      setVolumeState("low");
    } else if (video.volume >= 0.3 && video.volume < 0.7) {
      setVolumeState("middle");
    } else {
      setVolumeState("high");
    }

    if (active) {
      dispatch(updateVideoVolume(video.volume));

      clearTimeout(volumeTimer.current);
      volumeTimer.current = setTimeout(() => {
        localStorage.setItem("video-volume", video.volume);
      }, 500);
    }
  }, [dispatch, active]);

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
    if (currentTime / duration >= 0.9 && !selectedNext) {
      setDisplaySelector(true);
    } else {
      setDisplaySelector(false);
    }
  }, [selectedNext]);

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
      document.querySelector(".video-tree").requestFullscreen();
    }
  }, []);

  const fullscreenChangeHandler = useCallback(() => {
    if (document.fullscreenElement) {
      setFullscreen(true);
    } else {
      setFullscreen(false);
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
   * SELECTOR
   */

  const selectNextVideoHandler = useCallback(
    (nextId) => {
      dispatch(selectNextVideo(currentVideo.id, nextId));
      setSelectedNext(true);
      setDisplaySelector(false);
    },
    [dispatch, currentVideo.id]
  );

  /*
   * NAVIGATION
   */

  const restartVideoTreeHandler = useCallback(() => {
    dispatch(updateActiveVideo(videoTree.root));
  }, [dispatch, videoTree.root]);

  const navigateToPreviousVideoHandler = useCallback(() => {
    dispatch(updateActiveVideo(previousVideo));
  }, [dispatch, previousVideo]);

  const navigateToSelectorTimelineHandler = useCallback(() => {
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
    const src = currentVideo.info.url;

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
  }, [currentVideo.info.url, videoRef]);

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
    <div className={`video-player${active ? " active" : ""}`}>
      <div
        className="vp-container"
        ref={videoContainerRef}
        style={{ cursor: displayCursor }}
        tabIndex={-1}
        onMouseMove={showControlsHandler}
        onMouseLeave={hideControlsHandler}
        onKeyDown={keyEventHandler}
        // onContextMenu={preventDefault}
      >
        <video
          ref={videoRef}
          autoPlay={autoPlay}
          onLoadedMetadata={videoLoadHandler}
          onClick={togglePlayHandler}
          onPlay={videoPlayHandler}
          onPause={videoPauseHandler}
          onEnded={videoEndedHandler}
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
          <Playback
            playbackState={playbackState}
            onToggle={togglePlayHandler}
          />

          <Volume
            volumeState={volumeState}
            currentVolume={currentVolume}
            seekVolume={seekVolume}
            onToggle={toggleMuteHandler}
            onSeek={volumeInputChangeHandler}
            onKey={preventDefault}
          />

          <Progress
            bufferProgress={bufferProgress}
            currentProgress={currentProgress}
            videoDuration={videoDuration}
            seekProgress={seekProgress}
            seekTooltip={seekTooltip}
            seekTooltipPosition={seekTooltipPosition}
            onHover={seekMouseMoveHandler}
            onSeek={seekChangeHandler}
            onKey={preventDefault}
          />

          <Time time={displayTime} />

          <Fullscreen
            fullscreenState={fullscreen}
            onToggle={toggleFullscreenHandler}
          />
        </div>

        <Selector
          ref={videoSelectorRef}
          on={displaySelector}
          high={displayControls}
          next={currentVideo.children}
          onSelect={selectNextVideoHandler}
        />

        <Navigation
          on={editMode}
          activeVideo={activeVideo}
          videoTree={videoTree}
          onRestart={restartVideoTreeHandler}
          onPrev={navigateToPreviousVideoHandler}
          onNext={navigateToSelectorTimelineHandler}
        />

        <Loader on={displayLoader} />
      </div>
    </div>
  );
};

export default VideoPlayer;
