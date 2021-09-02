const SelectorTimer = ({ on, timer }) => {
  return (
    <div className={`vp-selector-timer${on ? " active" : ""}`}>
      <div
        className="vp-controls__range--current"
        style={{ width: timer + "%" }}
      />
    </div>
  );
};

export default SelectorTimer;
