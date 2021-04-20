import { ReactComponent as VolumeHighIcon } from "assets/icons/volume-high.svg";
import { ReactComponent as VolumeMiddleIcon } from "assets/icons/volume-middle.svg";
import { ReactComponent as VolumeLowIcon } from "assets/icons/volume-low.svg";
import { ReactComponent as VolumeMuteIcon } from "assets/icons/volume-mute.svg";

const Volume = ({ ctrl }) => {
  const {
    volumeButtonRef,
    toggleMute,
    currentVolumeRef,
    volumeInputRef,
    controlVolumeByInput,
  } = ctrl;

  return (
    <div className="vp-controls__volume">
      <div
        className="vp-controls__btn"
        ref={volumeButtonRef}
        onClick={toggleMute}
      >
        <VolumeHighIcon />
        <VolumeMiddleIcon className="hidden" />
        <VolumeLowIcon className="hidden" />
        <VolumeMuteIcon className="hidden" />
      </div>
      <div className="vp-controls__range--outer">
        <div className="vp-controls__range--inner">
          <div className="vp-controls__range--background" />
          <div className="vp-controls__range--current" ref={currentVolumeRef} />
          <input
            ref={volumeInputRef}
            type="range"
            onInput={controlVolumeByInput}
            max="1"
            step="0.05"
          />
        </div>
      </div>
    </div>
  );
};

export default Volume;
