import { ReactComponent as FullscreenIcon } from "assets/icons/fullscreen.svg";
import { ReactComponent as FullscreenExitIcon } from "assets/icons/fullscreen-exit.svg";

const Fullscreen = ({ ctrl }) => {
  const { fullscreenButtonRef, toggleFullscreen } = ctrl;

  return (
    <div
      className="vp-controls__btn"
      ref={fullscreenButtonRef}
      onClick={toggleFullscreen}
    >
      <FullscreenIcon />
      <FullscreenExitIcon className="hidden" />
    </div>
  );
};

export default Fullscreen;
