import React, { useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { createCommunicationMessageType } from "src/auth/api/requests";
import { closeIcon } from "src/icons/icons";
import OutsideClickHandler from "src/components/Staff/components/OutsideClickHandler";
import classes from "./NewCategory.module.css";
import { toast } from "react-toastify";

interface FormData {
  type: string;
}

interface NewCategoryProps {
  onClose: () => void;
}

const NewCategory: React.FC<NewCategoryProps> = ({ onClose }) => {
  const NewCategoryRef = useRef<HTMLDivElement | null>(null);
  const [type, setType] = useState<string>(""); // State to track input value

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value); // Update the title state with input value
  };
  const onSubmit = async (data: { type: string }) => {
    try {
      const response = await createCommunicationMessageType(data.type);
      toast.success("Category created succesfully");
      onClose(); // Close modal after successful category creation
    } catch (error) {
      console.error("Error creating category:", error);
      // Handle error or show toast message
      toast.error("Failed to create category");
    }
  };

  return (
    <>
      <Box className={classes.overlayInvite} />
      <Box className={classes.InviteModalWindow} ref={NewCategoryRef}>
        <OutsideClickHandler innerRef={NewCategoryRef} onClose={onClose} />
        <div className={classes.headingInvite}>
          <p className={classes.headingInviteTitle}>Create new category</p>
          <button className={classes.headingInviteCloseBtn} onClick={onClose}>
            {closeIcon}
          </button>
        </div>
        <form className={classes.formInvite} onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.formInviteInputContainer}>
            <label htmlFor="type" className={classes.label}>
              Title
            </label>
            <input
              className={classes.formInviteInput}
              type="text"
              id="title"
              placeholder="Enter category title"
              {...register("type", { required: "Title is required" })}
              value={type}
              onChange={handleInputChange}
            />
            {errors.type && (
              <span className={classes.error}>{errors.type.message}</span>
            )}
          </div>

          <div className={classes.InviteModalAction}>
            <Button
              className={classes.InviteModalSubmitButton}
              type="submit"
              variant="outlined"
              size="large"
              disabled={!type.trim()}
            >
              <Typography className={classes.InviteModalSubmitButtonTitle}>
                Create category
              </Typography>
            </Button>
          </div>
        </form>
      </Box>
    </>
  );
};

export default NewCategory;
