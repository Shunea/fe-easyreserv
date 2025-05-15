import React, { useState } from "react";
import { Button } from "@mui/material";
import classes from "./SpaceChange.module.css";
import { arrowLeftIcon, arrowRightIcon } from "../../../icons/icons";

type Props = {
  space: string;
  onSpaceChange: (space: string) => void;
  spaces: (string | undefined)[]; // Update the type to allow for undefined
};

const SpaceChange = ({ space, onSpaceChange, spaces }: Props) => {
  const [selectedSpace, setSelectedSpace] = useState<string | undefined>(space);

  const handleNextSpace = () => {
    const currentIndex = spaces.findIndex((s) => s === selectedSpace);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % spaces.length;
      const nextSpace = spaces[nextIndex];
      if (nextSpace !== undefined) {
        setSelectedSpace(nextSpace);
        onSpaceChange(nextSpace);
      }
    }
  };

  const handlePreviousSpace = () => {
    const currentIndex = spaces.findIndex((s) => s === selectedSpace);
    if (currentIndex !== -1) {
      const previousIndex = (currentIndex - 1 + spaces.length) % spaces.length;
      const previousSpace = spaces[previousIndex];
      if (previousSpace !== undefined) {
        setSelectedSpace(previousSpace);
        onSpaceChange(previousSpace);
      }
    }
  };

  return (
    <div className={classes.Quantity}>
      <div className={classes.QuantityField}>
        <Button
          onClick={handlePreviousSpace}
          className={classes.QuantityButton}
          disableRipple
        >
          {arrowLeftIcon}
        </Button>
        <input value={selectedSpace || ""} className={classes.QuantityInput} />
        <Button
          onClick={handleNextSpace}
          className={classes.QuantityButton}
          disableRipple
        >
          {arrowRightIcon}
        </Button>
      </div>
      <div className={classes.QuantityHelp}></div>
    </div>
  );
};

export default SpaceChange;
