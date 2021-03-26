import React from "react";

import { ReactComponent as PlayIcon } from "../assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "../assets/icons/pause.svg";
import { ReactComponent as ForwardIcon } from "../assets/icons/forward.svg";
import { ReactComponent as BackwardIcon } from "../assets/icons/backward.svg";
import { ReactComponent as VolumeUpIcon } from "../assets/icons/volume-up.svg";
import { ReactComponent as VolumeDownIcon } from "../assets/icons/volume-down.svg";
import "./ActionUI.css";

const ActionUI = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="action-ui">
      <div>
        <PlayIcon className="hidden" />
        <PauseIcon />
      </div>

      <div>
        <VolumeUpIcon />
        <VolumeUpIcon className="hidden" />
      </div>

      <div>
        <VolumeDownIcon />
        <VolumeDownIcon className="hidden" />
      </div>

      <div>
        <ForwardIcon />
        <ForwardIcon className="hidden" />
      </div>

      <div>
        <BackwardIcon />
        <BackwardIcon className="hidden" />
      </div>
    </div>
  );
});

export default ActionUI;
