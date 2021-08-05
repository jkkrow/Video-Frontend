import { ReactComponent as UserIcon } from "assets/icons/user.svg";
import "./Avatar.css";

const Avatar = ({ src, width, height, onClick }) => {
  return (
    <div
      className={`avatar${onClick ? " btn" : ""}`}
      style={{ width, height }}
      onClick={onClick}
    >
      {src ? <img src={src} alt="" /> : <UserIcon />}
    </div>
  );
};

export default Avatar;
