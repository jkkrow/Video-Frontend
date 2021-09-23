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
  onClose,
}) => {
  const submitHandler = (event) => {
    event.preventDefault();

    onConfirm();
  };

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
          onSubmit={submitHandler}
        >
          <h3 className="modal__header">{header}</h3>
          <div className="modal__content">{content}</div>
          <div className="modal__footer">
            {footer && (
              <Button loading={loading} disabled={disabled}>
                {footer}
              </Button>
            )}
            <Button type="button" onClick={onClose}>
              {footer ? "CANCEL" : "OK"}
            </Button>
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
        <div className="modal__backdrop" onClick={onClose} />
      </CSSTransition>
    </>,
    document.getElementById("modal-hook")
  );
};

export default Modal;
