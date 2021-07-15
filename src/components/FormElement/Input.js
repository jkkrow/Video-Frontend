import { useEffect, useReducer } from "react";

import { validate } from "util/validators";
import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.value,
      };

    case "FORM_CHANGE":
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators),
      };
    case "FORM_BLUR":
      return {
        ...state,
        isBlured: true,
      };
    default:
      return state;
  }
};

const Input = ({
  formElement,
  id,
  type,
  label,
  placeholder,
  initialValue,
  validators,
  autoFocus,
  rows,
  onChange,
  onBlur,
  onForm,
}) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initialValue || "",
    isValid: formElement ? false : true,
    isBlured: false,
  });

  useEffect(() => {
    if (formElement) {
      onForm(id, inputState.value, inputState.isValid);
    }
  }, [formElement, onForm, id, inputState]);

  const inputChangeHandler = (event) => {
    formElement
      ? dispatch({
          type: "FORM_CHANGE",
          value: event.target.value,
          validators: validators,
        })
      : dispatch({
          type: "CHANGE",
          value: event.target.value,
        });
  };

  const inputBlurHandler = () => {
    dispatch({ type: "FORM_BLUR" });
  };

  const element =
    type === "textarea" ? (
      <textarea
        id={id}
        rows={rows || 5}
        placeholder={placeholder}
        autoFocus={autoFocus}
        value={inputState.value}
        onChange={onChange || inputChangeHandler}
        onBlur={onBlur || inputBlurHandler}
      />
    ) : (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoFocus={autoFocus}
        value={inputState.value}
        onChange={onChange || inputChangeHandler}
        onBlur={onBlur || inputBlurHandler}
      />
    );

  return (
    <div
      className={`input__container${
        inputState.isBlured && !inputState.isValid ? " invalid" : ""
      }`}
    >
      {label && <label htmlFor={id}>{label}</label>}
      {element}
    </div>
  );
};

export default Input;
