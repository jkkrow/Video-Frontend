import { ReactComponent as LeftAngle } from "assets/icons/left-angle.svg";
import { ReactComponent as RightAngle } from "assets/icons/right-angle.svg";
import { ReactComponent as DoubleLeftAngle } from "assets/icons/double-left-angle.svg";
import { ReactComponent as Plus } from "assets/icons/plus.svg";
import { ReactComponent as Upload } from "assets/icons/upload.svg";
import { ReactComponent as Remove } from "assets/icons/remove.svg";
import "./IconButton.css";

const IconButton = ({ className, onClick, disabled, style }) => {
  let Component;

  switch (className.split(" ")[0]) {
    case "left-angle":
      Component = <LeftAngle />;
      break;
    case "right-angle":
      Component = <RightAngle />;
      break;
    case "double-left-angle":
      Component = <DoubleLeftAngle />;
      break;
    case "plus":
      Component = <Plus />;
      break;
    case "upload":
      Component = <Upload />;
      break;
    case "remove":
      Component = <Remove />;
      break;

    default:
      Component = null;
  }

  return (
    <button
      className={`icon-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {Component}
    </button>
  );
};

export default IconButton;
