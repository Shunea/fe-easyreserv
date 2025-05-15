import { useEffect } from "react";

function OutsideClickHandler({ innerRef, onClose }) {
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        innerRef.current &&
        !innerRef.current.contains(e.target) &&
        !e.target.closest(".MuiPickersPopper-root")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [innerRef, onClose]);

  return null;
}

export default OutsideClickHandler;
