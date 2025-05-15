import React from "react";
import { Box, Typography } from "@mui/material";
import NoEmployees from "../../images/NoEmployees";
import AddEmployeeButton from "./AddEmployee/AddEmployeeButton";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (value) => void;
};

const NoEmployeeAddedMessage = (props: Props) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "20%",
        left: "38%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
      }}
    >
      <img
        src={`data:image/svg+xml;base64,${btoa(NoEmployees)}`}
        alt="No Employees"
      />
      <div>
        <Typography
          sx={{
            color: "rgba(2, 2, 2, 1)",
            fontFamily: "Inter",
            fontWeight: "600",
            fontSize: "32px",
            lineHeight: "38.4px",
            textTransform: "none",
            letterSpacing: "-2%",
          }}
        >
          You have no employees
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "rgba(2, 2, 2, 1)",
            fontFamily: "Inter",
            fontWeight: "400",
            fontSize: "16px",
            lineHeight: "28px",
            textTransform: "none",
            textAlign: "center",
          }}
        >
          Let's start adding your first team member
        </Typography>
      </div>
      <div>
        <AddEmployeeButton
          text="Invite employee"
          isModalOpen={props.isModalOpen}
          setIsModalOpen={props.setIsModalOpen}
        />
      </div>
    </Box>
  );
};

export default NoEmployeeAddedMessage;
