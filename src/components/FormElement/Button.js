import LoadingSpinner from "components/UI/Loader/LoadingSpinner";
import "./Button.css";

const Button = ({
  className,
  type,
  onClick,
  loading,
  disabled,
  danger,
  children,
}) => {
  return (
    <button
      className={`button ${className}${danger ? " danger" : ""}`}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ position: loading ? "relative" : "" }}
    >
      {children}
      <LoadingSpinner on={loading} overlay />
    </button>
  );
};

export default Button;
