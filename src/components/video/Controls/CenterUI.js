import { ReactComponent as PlayIcon } from "assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "assets/icons/pause.svg";
import { ReactComponent as VolumeUpIcon } from "assets/icons/volume-up.svg";
import { ReactComponent as VolumeDownIcon } from "assets/icons/volume-down.svg";
import { ReactComponent as ForwardIcon } from "assets/icons/forward.svg";
import { ReactComponent as BackwardIcon } from "assets/icons/backward.svg";

const CenterUI = ({ ctrl }) => {
  const { centerUIRef } = ctrl;

  return (
    <div className="vp-center-ui" ref={centerUIRef}>
      <div>
        <PlayIcon />
        <PauseIcon className="hidden" />
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
};

export default CenterUI;
