import { memo } from "react";

import { ReactComponent as DoubleAngleLeftIcon } from "assets/icons/double-angle-left.svg";
import { ReactComponent as AngleLeftIcon } from "assets/icons/angle-left.svg";
import { ReactComponent as AngleRightIcon } from "assets/icons/angle-right.svg";
import { ReactComponent as MarkerIcon } from "assets/icons/marker.svg";
import Tooltip from "components/UI/Tooltip";

const Navigation = ({
  activeVideo,
  videoTree,
  onRestart,
  onPrev,
  onNext,
  onMark,
}) => (
  <div className="vp-navigation">
    <Tooltip text="Return to first video" direction="bottom">
      <DoubleAngleLeftIcon
        className={activeVideo.id === videoTree.root.id ? "disabled" : ""}
        onClick={activeVideo.id !== videoTree.root.id ? onRestart : null}
      />
    </Tooltip>
    <Tooltip text="Back to previous video" direction="bottom">
      <AngleLeftIcon
        className={activeVideo.id === videoTree.root.id ? "disabled" : ""}
        onClick={activeVideo.id !== videoTree.root.id ? onPrev : null}
      />
    </Tooltip>
    <Tooltip text="Skip to next video" direction="bottom">
      <AngleRightIcon onClick={onNext} />
    </Tooltip>
    <Tooltip text="Mark timeline" direction="bottom">
      <MarkerIcon onClick={onMark} />
    </Tooltip>
  </div>
);

export default memo(Navigation);
