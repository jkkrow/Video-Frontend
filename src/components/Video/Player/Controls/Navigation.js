import { memo } from "react";

import { ReactComponent as DoubleAngleLeftIcon } from "assets/icons/double-angle-left.svg";
import { ReactComponent as AngleLeftIcon } from "assets/icons/angle-left.svg";
import { ReactComponent as AngleRightIcon } from "assets/icons/angle-right.svg";
import { ReactComponent as MarkerIcon } from "assets/icons/marker.svg";

const Navigation = ({
  on,
  activeVideo,
  videoTree,
  onRestart,
  onPrev,
  onNext,
  onMark,
}) =>
  on && (
    <div className="vp-navigation">
      <DoubleAngleLeftIcon
        className={activeVideo.id === videoTree.root.id ? "disabled" : ""}
        onClick={activeVideo.id !== videoTree.root.id ? onRestart : null}
      />
      <AngleLeftIcon
        className={activeVideo.id === videoTree.root.id ? "disabled" : ""}
        onClick={activeVideo.id !== videoTree.root.id ? onPrev : null}
      />
      <AngleRightIcon onClick={onNext} />
      <MarkerIcon onClick={onMark} />
    </div>
  );

export default memo(Navigation);
