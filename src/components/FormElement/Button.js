import LoadingSpinner from "components/UI/Loader/LoadingSpinner";
import "./Button.css";

const Button = ({ className, type, onClick, loading, disabled, children }) => {
  return (
    <button
      className={`button ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ position: true ? "relative" : "" }}
    >
      {children}
      <LoadingSpinner on={loading} overlay />
    </button>
  );
};

export default Button;
