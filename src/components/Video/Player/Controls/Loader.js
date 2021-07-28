import { memo } from "react";

const Loader = ({ on }) =>
  on && (
    <div className="vp-loader__container">
      <div className="vp-loader" />
    </div>
  );

export default memo(Loader);
