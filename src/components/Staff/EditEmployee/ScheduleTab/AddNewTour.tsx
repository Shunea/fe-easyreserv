import React from "react";
import Button from "@mui/material/Button";
import { plusIcon } from "src/icons/icons";
import classes from "./EditEmployeeTour.module.css";
import { toast } from "react-toastify";

type Props = {
  onButtonClick: () => void;
  addedLenght: number;
  existingLenght: number;
  workingDaysCount: number;
};
const AddNewTour = ({
  onButtonClick,
  addedLenght,
  existingLenght,
  workingDaysCount,
}: Props) => {
  const notify = () =>
    toast.warning(
      "The number of working days must be equal to number of added tours!",
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );
  const handleButtonClick = () => {
    if (addedLenght > 0 && addedLenght === workingDaysCount) {
      notify();
    } else {
      onButtonClick();
    }
  };
  return (
    <Button
      className={classes.ScheduleTourButton}
      startIcon={plusIcon}
      sx={{ color: "orange" }}
      disableRipple
      onClick={handleButtonClick}
      disabled={addedLenght + existingLenght >= 7}
    >
      <span className={classes.ScheduleTourButtonText}>
        Add new working tour
      </span>
    </Button>
  );
};
export default AddNewTour;
