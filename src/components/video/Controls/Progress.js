const Progress = ({ ctrl }) => {
  const {
    bufferProgressRef,
    currentProgressRef,
    seekProgressRef,
    updateSeekTooltip,
    skipByInput,
    seekTooltipRef,
  } = ctrl;

  return (
    <div className="vp-controls__progress">
      <div className="vp-controls__range--background" />
      <div className="vp-controls__range--buffer" ref={bufferProgressRef} />
      <div className="vp-controls__range--current" ref={currentProgressRef} />
      <input
        className="vp-controls__range--seek"
        ref={seekProgressRef}
        defaultValue="0"
        step="0.1"
        type="range"
        onMouseMove={updateSeekTooltip}
        onInput={skipByInput}
      />
      <span className="vp-controls__range--seek-tooltip" ref={seekTooltipRef}>
        00:00
      </span>
    </div>
  );
};

export default Progress;
