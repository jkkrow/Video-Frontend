import "./LoadingSpinner.css";

const LoadingSpinner = ({ display, size }) =>
  display ? (
    <div className="loading-spinner__container">
      <div
        className={`loading-spinner${size === "small" ? " small" : ""}${
          size === "big" ? " big" : ""
        }`}
      />
    </div>
  ) : null;

export default LoadingSpinner;
