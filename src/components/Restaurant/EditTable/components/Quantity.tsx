import React from "react";
import { Button } from "@mui/material";
import classes from "./Quantity.module.css";
import { minusIcon, blackPlusIcon } from "../../../../icons/icons";

type Props = {
  count: number;
  onDecrementClick: () => void;
  onIncrementClick: () => void;
  minCount: number;
  label: string;
};
const Quantity = ({
  count,
  onDecrementClick,
  onIncrementClick,
  minCount,
  label,
}: Props) => {
  return (
    <div className={classes.Quantity}>
      <div className={classes.QuantityLabel}>{label}</div>
      <div className={classes.QuantityField}>
        <Button
          onClick={() => onDecrementClick()}
          disabled={count <= minCount}
          className={classes.QuantityButton}
          disableRipple
        >
          {minusIcon}
        </Button>
        <input
          type="text"
          className={classes.QuantityInput}
          value={count}
        ></input>
        <Button
          onClick={() => onIncrementClick()}
          disabled={count >= 7}
          className={classes.QuantityButton}
          disableRipple
        >
          {blackPlusIcon}
        </Button>
      </div>
      <div className={classes.QuantityHelp}></div>
    </div>
  );
};
export default Quantity;
