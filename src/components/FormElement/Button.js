import LoadingSpinner from "components/UI/Loader/LoadingSpinner";
import "./Button.css";

const Button = ({
  className,
  type,
  onClick,
  loading,
  disabled,
  invalid,
  inversed,
  children,
}) => {
  return (
    <button
      className={`button${className ? " " + className : ""}${
        invalid ? " invalid" : ""
      }${inversed ? " inversed" : ""}`}
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
