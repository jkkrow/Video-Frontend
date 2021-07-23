import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";

import Button from "components/FormElement/Button";
import "./Modal.css";

const Modal = ({
  on,
  className,
  style,
  header,
  children,
  footer,
  onSubmit = (e) => e.prevetDefault(),
  onCancel,
}) => {
  return createPortal(
    <>
      <CSSTransition
        in={on}
        classNames="modal"
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
        <div
          className={`modal__container${className ? " " + className : ""}`}
          style={style}
        >
          <header className="modal__header">{header}</header>
          <form onSubmit={onSubmit}>
            <div className="modal__content">{children}</div>
            <footer className="modal__footer">
              <Button>
                onClick={onSubmit}
                {footer}
              </Button>
              <Button onClick={onCancel}>Cancel</Button>
            </footer>
          </form>
        </div>
      </CSSTransition>
    </>,
    document.getElementById("modal-hook")
  );
};

export default Modal;
