import { memo } from "react";

import { ReactComponent as VolumeHighIcon } from "assets/icons/volume-high.svg";
import { ReactComponent as VolumeMiddleIcon } from "assets/icons/volume-middle.svg";
import { ReactComponent as VolumeLowIcon } from "assets/icons/volume-low.svg";
import { ReactComponent as VolumeMuteIcon } from "assets/icons/volume-mute.svg";

const Volume = ({
  volumeState,
  currentVolume,
  seekVolume,
  onToggle,
  onSeek,
  onKey,
}) => (
  <div className="vp-controls__volume">
    <button className="vp-controls__btn" onClick={onToggle}>
      {volumeState === "high" && <VolumeHighIcon />}
      {volumeState === "middle" && <VolumeMiddleIcon />}
      {volumeState === "low" && <VolumeLowIcon />}
      {volumeState === "mute" && <VolumeMuteIcon />}
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
          onChange={onSeek}
          onKeyDown={onKey}
        />
      </div>
    </div>
  </div>
);

export default memo(Volume);
