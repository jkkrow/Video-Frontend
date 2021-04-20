const Spinner = ({ ctrl }) => {
  const { loadingSpinnerRef } = ctrl;

  return (
    <div className="vp-spinner__container" ref={loadingSpinnerRef}>
      <div className="vp-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;
