const Time = ({ ctrl }) => {
  const { timeRef } = ctrl;

  return (
    <div className="vp-controls__time">
      <time ref={timeRef}></time>
    </div>
  );
};

export default Time;
