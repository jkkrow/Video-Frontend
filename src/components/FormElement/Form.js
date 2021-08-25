import { useState, Children, cloneElement } from "react";

import "./Form.css";

const Form = ({ className, style, children, onSubmit }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    onSubmit(event);
  };

  return (
    <form className={className} style={style} onSubmit={submitHandler}>
      {Children.map(children, (child) =>
        cloneElement(child, { isValidated: isSubmitted })
      )}
    </form>
  );
};

export default Form;
