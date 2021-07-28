import { memo } from "react";

import { ReactComponent as DoubleAngleLeftIcon } from "assets/icons/double-angle-left.svg";
import { ReactComponent as AngleLeftIcon } from "assets/icons/angle-left.svg";
import { ReactComponent as AngleRightIcon } from "assets/icons/angle-right.svg";

const Navigation = ({
  on,
  activeVideo,
  videoTree,
  onRestart,
  onPrev,
  onNext,
}) =>
  on && (
    <div className="vp-navigation">
      {activeVideo !== videoTree.root && (
        <DoubleAngleLeftIcon onClick={onRestart} />
      )}
      {activeVideo !== videoTree.root && <AngleLeftIcon onClick={onPrev} />}
      <AngleRightIcon onClick={onNext} />
    </div>
  );

export default memo(Navigation);
