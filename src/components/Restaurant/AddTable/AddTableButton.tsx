import React from "react";
import { Button, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { plusIcon } from "../../../icons/icons";
import classes from "./AddTableButton.module.css";
import { useState } from "react";
import AddModal from "./AddModal";
import { toast } from "react-toastify";

type CustomButtonProps = {
  text: string;
  selectedSpaceId?: string;
  placeType: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  selectedSpaceId,
  placeType,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpaceSelected, setIsSpaceSelected] = useState(false);

  const handleOpenModal = () => {
    if (selectedSpaceId) {
      setIsModalOpen(true);
      setIsSpaceSelected(true);
    } else {
      toast.error("Space not selected");
      setIsSpaceSelected(false);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const plusColor = "#FFF";

  return (
    <>
      <Button
        className={classes.AddTableButton}
        variant="outlined"
        size="large"
        startIcon={plusIcon}
        onClick={handleOpenModal}
        style={{ color: plusColor }}
      >
        <Typography className={classes.AddTableButtonText}>{text}</Typography>
      </Button>

      {isModalOpen && (
        <AddModal
          onClose={handleCloseModal}
          selectedSpaceId={selectedSpaceId}
          placeType={placeType}
        />
      )}
    </>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CustomButton;
