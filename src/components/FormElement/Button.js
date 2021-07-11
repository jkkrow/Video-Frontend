import Loader from "components/UI/Loader/LoadingSpinner";
import "./Button.css";

const Button = ({ type, onClick, loading, disabled, children }) => {
  return (
    <button
      className="button"
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ position: loading ? "relative" : "" }}
    >
      {children}
      <Loader dispaly={loading} />
    </button>
  );
};

export default Button;
