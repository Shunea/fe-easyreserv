import React from "react";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import { plusIcon } from "../../../icons/icons";
import classes from "./AddCategoryButton.module.css";
import { useState } from "react";
import NewCategory from "./NewCategory";

type CustomButtonProps = { text: string };

const CustomButton: React.FC<CustomButtonProps> = ({ text }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button className={classes.AddEmployeeButton} onClick={handleOpenModal}>
        <span className={classes.AddCategoryIcon}>{plusIcon}</span>
        <Typography className={classes.AddEmployeeButtonText}>
          {text}
        </Typography>
      </button>

      {isModalOpen && <NewCategory onClose={handleCloseModal} />}
    </>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CustomButton;
