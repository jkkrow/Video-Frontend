import { forwardRef, memo } from "react";

const Selector = forwardRef(({ on, high, next, onSelect }, ref) => (
  <div
    className={`vp-selector__container${on ? " active" : ""}${
      high ? " high" : ""
    }`}
    ref={ref}
  >
    {next.map(
      (video) =>
        video.info && (
          <button
            key={video.id}
            className="vp-selector"
            onClick={() => onSelect(video)}
          >
            {video.info.label}
          </button>
        )
    )}
  </div>
));

export default memo(Selector);
