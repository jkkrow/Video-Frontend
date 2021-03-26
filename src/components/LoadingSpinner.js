import React from "react";

import "./LoadingSpinner.css";

const LoadingSpinner = React.forwardRef((props, ref) => {
  return (
    <div className="lds-spinner__container" ref={ref}>
      <div className="lds-spinner">
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
});

export default LoadingSpinner;
