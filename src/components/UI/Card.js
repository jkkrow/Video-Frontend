import { forwardRef } from "react";

import "./Card.css";

const Card = forwardRef(({ children, className, style }, ref) => {
  return (
    <div
      className={`card ${className ? " " + className : ""}`}
      style={style}
      ref={ref}
    >
      {children}
    </div>
  );
});

export default Card;
