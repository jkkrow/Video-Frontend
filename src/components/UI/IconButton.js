import "./IconButton.css";

const IconButton = ({ className, onClick, disabled, Component }) => {
  return (
    <button
      className={`icon-button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Component />
    </button>
  );
};

export default IconButton;
