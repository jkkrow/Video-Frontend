import { ReactComponent as RectIcon } from "assets/icons/rect.svg";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ on, overlay }) =>
  on ? (
    <div className={`loading-spinner__container${overlay ? " overlay" : ""}`}>
      <RectIcon className="loading-spinner--1" />
      <RectIcon className="loading-spinner--2" />
      <RectIcon className="loading-spinner--3" />
    </div>
  ) : null;

export default LoadingSpinner;
