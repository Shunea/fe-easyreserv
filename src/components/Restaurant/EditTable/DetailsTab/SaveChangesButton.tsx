import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";
import classes from "./SaveChangesButton.module.css";

type SaveChangesButtonProps = {
  // formIsValid?: boolean;
};

const SaveChangesButton: React.FC<SaveChangesButtonProps> = (
  // {
  //   formIsValid,
  // }
) => {
  return (
    <div className={classes.BoxFormAction}>
      <Button
        className={classes.BoxFormSubmitButton}
        type="submit"
        variant="outlined"
        size="large"
        // disabled={!formIsValid}
      >
        <Typography className={classes.BoxFormSubmitButtonTitle}>
          Save changes
        </Typography>
      </Button>
    </div>
  );
};
export default SaveChangesButton;
