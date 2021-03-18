import React from "react";

import { ReactComponent as PlayIcon } from "../assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "../assets/icons/pause.svg";
import { ReactComponent as ForwardIcon } from "../assets/icons/forward.svg";
import { ReactComponent as BackwardIcon } from "../assets/icons/backward.svg";
import { ReactComponent as VolumeHighIcon } from "../assets/icons/volume-high.svg";
import { ReactComponent as VolumeLowIcon } from "../assets/icons/volume-low.svg";
import "./PlaybackAnimation.css";

const PlaybackAnimation = (props) => {
  return (
    <React.Fragment>
      <div className="playback-animation" ref={props.playbackRef}>
        <PlayIcon className="hidden" />
        <PauseIcon />
      </div>

      <div className="playback-animation" ref={props.forwardRef}>
        <ForwardIcon />
        <ForwardIcon className="hidden" />
      </div>

      <div className="playback-animation" ref={props.backwardRef}>
        <BackwardIcon />
        <BackwardIcon className="hidden" />
      </div>

      <div className="playback-animation" ref={props.upRef}>
        <VolumeHighIcon />
        <VolumeHighIcon className="hidden" />
      </div>

      <div className="playback-animation" ref={props.downRef}>
        <VolumeLowIcon />
        <VolumeLowIcon className="hidden" />
      </div>
    </React.Fragment>
  );
};

export default PlaybackAnimation;
