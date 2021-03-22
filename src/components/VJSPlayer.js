import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";

import "./VJSPlayer.css";
import "video.js/dist/video-js.css";

const usePlayer = ({ src }) => {
  const [player, setPlayer] = useState();
  const videoRef = useRef();

  useEffect(() => {
    const options = {
      fill: true,
      //   fluid: true,
      //   preload: "auto",
      html5: {
        hls: {
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          overrideNative: true,
        },
      },
    };

    const vjsPlayer = videojs(videoRef.current, {
      ...options,
      controls: true,
      dataSetup: { techOrder: ["youtube"], sources: [src] },
    });
    setPlayer(vjsPlayer);

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [src, player]);

  useEffect(() => {
    if (player) {
      player.src({ src });
    }
  }, [player, src]);

  return videoRef;
};

const VJSPlayer = ({ src }) => {
  const playerRef = usePlayer({ src });

  return (
    <div className="video-js">
      <video ref={playerRef} className="vjs-player" />
    </div>
  );
};

export default VJSPlayer;
