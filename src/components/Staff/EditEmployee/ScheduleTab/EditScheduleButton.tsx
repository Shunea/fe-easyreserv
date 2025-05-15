import React from "react";
import { EditWorkerIcon } from "src/icons/icons";
import classes from "./EditScheduleButton.module.css";

type Props = { onClick: any };

const EditScheduleButton = (props: Props) => {
  return (
    <button className={classes.Button} onClick={props.onClick}>
      {EditWorkerIcon}
      <span className={classes.ButtonText}>Edit schedule</span>
    </button>
  );
};
export default EditScheduleButton;
