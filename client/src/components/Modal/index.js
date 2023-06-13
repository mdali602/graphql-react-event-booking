import React from "react";

import "./Modal.css";

const Modal = ({
  title,
  children,
  canCancel,
  canConfirm,
  confirmText = "Confirm",
  onCancel,
  onConfirm,
}) => (
  <div className="modal">
    <header className="modal__header">{title}</header>
    <section className="modal__content">{children}</section>
    <section className="modal__actions">
      {canCancel && (
        <button className="btn" onClick={onCancel}>
          Cancel
        </button>
      )}
      {canConfirm && (
        <button className="btn" onClick={onConfirm}>
          {confirmText}
        </button>
      )}
    </section>
  </div>
);

export default Modal;
