import React from "react";

import { ReactComponent as PlayIcon } from "../assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "../assets/icons/pause.svg";
import { ReactComponent as ForwardIcon } from "../assets/icons/forward.svg";
import { ReactComponent as BackwardIcon } from "../assets/icons/backward.svg";
import { ReactComponent as VolumeUpIcon } from "../assets/icons/volume-up.svg";
import { ReactComponent as VolumeDownIcon } from "../assets/icons/volume-down.svg";
import "./CenterDisplay.css";

const CenterDisplay = (props) => {
  return (
    <React.Fragment>
      <div className="center-display" ref={props.playbackRef}>
        <PlayIcon className="hidden" />
        <PauseIcon />
      </div>

      <div className="center-display" ref={props.forwardRef}>
        <ForwardIcon />
        <ForwardIcon className="hidden" />
      </div>

      <div className="center-display" ref={props.backwardRef}>
        <BackwardIcon />
        <BackwardIcon className="hidden" />
      </div>

      <div className="center-display" ref={props.upRef}>
        <VolumeUpIcon />
        <VolumeUpIcon className="hidden" />
      </div>

      <div className="center-display" ref={props.downRef}>
        <VolumeDownIcon />
        <VolumeDownIcon className="hidden" />
      </div>
    </React.Fragment>
  );
};

export default CenterDisplay;
