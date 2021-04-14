import React, { useRef, useEffect, useCallback } from "react";
import "./VideoShakaPlayer.css";
const shaka = require("shaka-player/dist/shaka-player.ui.js");

//Creating class component
const VideoPlayer = ({ src }) => {
  const videoRef = useRef();
  const videoContainerRef = useRef();

  const onError = useCallback((error) => {
    // Log the error.
    console.error("Error code", error.code, "object", error);
  }, []);

  const onErrorEvent = useCallback(
    (event) => {
      // Extract the shaka.util.Error object from the event.
      onError(event.detail);
    },
    [onError]
  );

  useEffect(() => {
    //Getting reference to video and video container on DOM
    const video = videoRef.current;
    const videoContainer = videoContainerRef.current;

    //Initialize shaka player
    let player = new shaka.Player(video);

    //Setting UI configuration JSON object
    const uiConfig = {};

    //Configuring elements to be displayed on video player control panel
    uiConfig["controlPanelElements"] = [
      "play_pause",
      "mute",
      "volume",
      "time_and_duration",
      "fullscreen",
    ];

    //Setting up shaka player UI
    const ui = new shaka.ui.Overlay(player, videoContainer, video);

    ui.configure(uiConfig); //configure UI
    ui.getControls();

    // Listen for error events.
    player.addEventListener("error", onErrorEvent);

    // Try to load a manifest.
    // This is an asynchronous process.
    player
      .load(src)
      .then(() => {
        // This runs if the asynchronous load is successful.
        console.log("The video has now been loaded!");
      })
      .catch(onError); // onError is executed if the asynchronous load fails.
  }, [src, onError, onErrorEvent]);

  /*
		Returning video with a container. Remember, when setting up shaka player with custom UI, you must
		add your video component inside a container
		The container will be used by shaka player to add your customized UI for the player
		*/
  return (
    <div className="video-container" ref={videoContainerRef}>
      <video className="shaka-video" ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
