import { ReactComponent as PlayIcon } from "assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "assets/icons/pause.svg";

const Playback = ({ ctrl }) => {
  const { playButtonRef, togglePlay } = ctrl;

  return (
    <div className="vp-controls__playback">
      <div
        className="vp-controls__btn"
        ref={playButtonRef}
        onClick={togglePlay}
      >
        <PlayIcon />
        <PauseIcon className="hidden" />
      </div>
    </div>
  );
};

export default Playback;
