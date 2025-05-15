import React from "react";
import classes from "./reservations.module.css";
import { mealsIcon } from "src/icons/icons";

type Props = {
  table: any;
};

const Reservations = (props: Props) => {
  return (
    <div className={classes.question_container}>
      <div className={classes.icon}>{mealsIcon}</div>
      <div className={classes.message}>
        No reservations available for this table
      </div>
    </div>
  );
};

export default Reservations;
