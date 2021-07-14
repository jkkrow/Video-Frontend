import "./Input.css";

const Input = ({ className, type, label, placeholder }) => {
  const element =
    type === "textarea" ? (
      <textarea className={`input ${className}`} placeholder={placeholder} />
    ) : (
      <input
        className={`input ${className}`}
        type={type}
        placeholder={placeholder}
      />
    );

  return (
    <div className="input__container">
      <label>
        {label} {element}
      </label>
    </div>
  );
};

export default Input;
