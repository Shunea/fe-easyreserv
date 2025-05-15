import React from "react";
import classees from "./Modal.module.css";
import BootstrapModal from "react-bootstrap/Modal";
import Button from "./Button";

const Modal = (props) => {
  return (
    <BootstrapModal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <BootstrapModal.Header>
        <BootstrapModal.Title id="contained-modal-title-vcenter"></BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body className={classees.modal_body}>
        <h2>{props.title}</h2>
        <p>{props.text}</p>
      </BootstrapModal.Body>
      <BootstrapModal.Footer>
        <Button
          text={props.cancelbuttontext}
          secondary
          onClick={props.cancel}
        />
        <Button text={props.acceptbuttontext} onClick={props.accept} />
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
};

export default Modal;
