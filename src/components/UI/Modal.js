import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";

import Button from "components/FormElement/Button";
import "./Modal.css";

const Modal = ({
  on,
  className,
  style,
  header,
  content,
  footer,
  loading,
  disabled,
  onConfirm,
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
        <form
          className={`modal__container${className ? " " + className : ""}`}
          style={style}
          onSubmit={(e) => e.preventDefault()}
        >
          <h3 className="modal__header">{header}</h3>
          <div className="modal__content">{content}</div>
          <div className="modal__footer">
            {footer && (
              <Button onClick={onConfirm} loading={loading} disabled={disabled}>
                {footer}
              </Button>
            )}
            <Button onClick={onCancel}>CANCEL</Button>
          </div>
        </form>
      </CSSTransition>
      <CSSTransition
        in={on}
        classNames="backdrop"
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
        <div className="modal__backdrop" onClick={onCancel} />
      </CSSTransition>
    </>,
    document.getElementById("modal-hook")
  );
};

export default Modal;
