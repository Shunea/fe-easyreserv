import React from "react";
import { Button, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { plusIcon } from "../../../icons/icons";
import classes from "./AddEmployeeButton.module.css";
import { useState } from "react";
import InviteModal from "./InviteModal";

type CustomButtonProps = {
  text: string;
  isModalOpen?: boolean;
  setIsModalOpen?: (value: boolean) => void;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  isModalOpen,
  setIsModalOpen,
}) => {
  const handleOpenModal = () => {
    if (setIsModalOpen) {
      setIsModalOpen(true);
    }
  };
  const handleCloseModal = () => {
    if (setIsModalOpen) {
      setIsModalOpen(false);
    }
  };
  const plusColor = "#FFF";
  const autoWidth = "auto";

  return (
    <>
      <Button
        className={classes.AddEmployeeButton}
        variant="outlined"
        size="large"
        startIcon={plusIcon}
        onClick={handleOpenModal}
        style={{ color: plusColor, width: autoWidth }}
      >
        <Typography className={classes.AddEmployeeButtonText}>
          {text}
        </Typography>
      </Button>

      {isModalOpen && <InviteModal onClose={handleCloseModal} />}
    </>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CustomButton;
