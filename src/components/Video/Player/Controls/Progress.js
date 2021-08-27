import { memo } from "react";

const Progress = ({
  bufferProgress,
  currentProgress,
  videoDuration,
  seekProgress,
  seekTooltipPosition,
  seekTooltip,
  timelineStart,
  timelineEnd,
  editMode,
  onHover,
  onSeek,
  onKey,
}) => {
  const timelineStartPosition =
    (timelineStart >= videoDuration ? videoDuration - 10 : timelineStart) ||
    videoDuration - 10;

  const timelineEndPosition =
    (timelineEnd > videoDuration ? videoDuration : timelineEnd) ||
    videoDuration;

  const timelineDuration =
    ((timelineEndPosition - timelineStartPosition) / videoDuration) * 100 + "%";

  return (
    <div className="vp-controls__progress">
      <div className="vp-controls__range--background" />
      <div
        className="vp-controls__range--buffer"
        style={{ width: bufferProgress }}
      />
      {editMode && (
        <div
          className="vp-controls__range--timeline"
          style={{
            left: (timelineStartPosition / videoDuration) * 100 + "%",
            width: timelineDuration,
          }}
        />
      )}
      <div
        className="vp-controls__range--current"
        style={{ width: currentProgress }}
      />
      <input
        className="vp-controls__range--seek"
        type="range"
        step="0.1"
        max={videoDuration}
        value={seekProgress}
        onMouseMove={onHover}
        onChange={onSeek}
        onKeyDown={onKey}
      />
      <span
        className="vp-controls__range--seek-tooltip"
        style={{ left: seekTooltipPosition }}
      >
        {seekTooltip}
      </span>
    </div>
  );
};

export default memo(Progress);
