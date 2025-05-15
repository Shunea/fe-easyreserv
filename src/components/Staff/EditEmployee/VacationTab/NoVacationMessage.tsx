import { Button } from "@mui/material";
import React from "react";
import { plusIcon } from "../../../../icons/icons";
import NoVacations from "../../../../images/NoVacations";
import classes from "./NoVacationMessage.module.css";

type Props = { onClick: () => void };
const NoVacationMessage = (props: Props) => {
  return (
    <div className={classes.NoVacationMesage}>
      <img
        src={`data:image/svg+xml;base64,${btoa(NoVacations)}`}
        alt="No Employees"
      />
      <div className={classes.NoVacationTextContainer}>
        <span className={classes.NoVacationText}>No scheduled vacations</span>
      </div>
      <Button
        className={classes.AddVacationButton}
        variant="outlined"
        size="large"
        startIcon={plusIcon}
        style={{ color: "#FFF" }}
        disableRipple
      >
        <span className={classes.AddVacationButtonText} onClick={props.onClick}>
          Add vacation
        </span>
      </Button>
    </div>
  );
};
export default NoVacationMessage;
