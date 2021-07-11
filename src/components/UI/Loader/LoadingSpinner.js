import "./LoadingSpinner.css";

const LoadingSpinner = ({ display }) =>
  display ? (
    <div className="loading-spinner__container">
      <div className="loading-spinner" />
    </div>
  ) : null;

export default LoadingSpinner;
