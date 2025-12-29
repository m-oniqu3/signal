import React from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
  closeModal: () => void;
};

function Modal({ children, closeModal }: Props) {
  const el = document.getElementById("modal");

  if (!el) return null;
  return createPortal(
    <div
      className="fixed p-4 w-full inset-0 flex items-center justify-center z-50 bg-black/30"
      onClick={closeModal}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>,
    el
  );
}

export default Modal;
