import React, { useEffect, useState } from "react";
import Title from "../../Title";
import {  plusIcon, tablesBigIcon } from "../../../icons/icons";
import {  getSpaces } from "src/auth/api/requests";
import { Col, Row } from "react-bootstrap";
import classes from "../NoTables/NoTablesAddedMessage.module.css";
import { ToastContainer } from "react-toastify";
import NewSpaceForm from "../Spaces/NewSpaceForm";
import HalfPageForm from "src/UI/HalfPageForm";
import { Button, Typography } from "@mui/material";
import classesAddSpace from "../AddTable/AddTableButton.module.css";

type Props = {};

const NoRestaurantAddedMessage = (props: Props) => {
  const [showCreateSpaces, setShowCreateSpaces] = useState(false);
  const [spaceOptions, setSpaceOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState();

  const [title, setTitle] = useState("Create a business");
  const [subtitle, setSubtitle] = useState("to plan your restaurant");

  useEffect(() => {
    if (showCreateSpaces) {
      document.body.style.position = "sticky";
      document.body.style.overflow = "hidden";
    }
    if (!showCreateSpaces) {
      document.body.style.position = "static";
      document.body.style.overflowY = "scroll";
    }
  }, [showCreateSpaces]);
  const [selectedRestaurant, setSelectedRestaurant] = useState();

  const storedRestaurant = JSON.parse(
    localStorage.getItem("selectedRestaurant") ?? "null"
  );

  useEffect(() => {
    const storedRestaurant = JSON.parse(
      localStorage.getItem("selectedRestaurant") ?? "null"
    );
    if (storedRestaurant) {
      const selectedRestaurantFromCookie = storedRestaurant;
      setSelectedRestaurant(selectedRestaurantFromCookie);
      if (selectedRestaurantFromCookie !== undefined) {
        setTitle(selectedRestaurantFromCookie.name);
        setSubtitle(selectedRestaurantFromCookie.address);
      }
      getSpaces(selectedRestaurantFromCookie.id)
        .then((spaces) => {
          //current restaurant
          const formattedOptions = spaces.map((space) => ({
            value: space.id,
            label: space.name,
          }));
          setSpaceOptions(formattedOptions);
        })
        .catch((err) => {
          console.error(`Error getting spaces ${err}`);
        });
    }
  }, []);

  const handleRedirect = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };

  const handleOpenCreateSpaces = () => {
    setShowCreateSpaces(true);
  };

  const handleCloseCreateSpaces = () => {
    setShowCreateSpaces(false);
  };

  return (
    <>
      <Row>
        <Col xs={12} lg={6}>
          <Title title={title} subtitle={subtitle} />
        </Col>
      </Row>
      <Col className={`${classes.menu} my-auto`}>
        <div className={classes.icon_container}>{tablesBigIcon}</div>
        <div className={classes.menu_title}>
          <Title
            title="You have no spaces"
            subtitle="Let's start by adding your first space"
          />
        </div>
        <Button
          className={classesAddSpace.AddTableButton}
          variant="outlined"
          size="large"
          startIcon={plusIcon}
          onClick={handleOpenCreateSpaces}
          style={{ color: "#FFF" }}
        >
          <Typography className={classesAddSpace.AddTableButtonText}>
            Create Spaces
          </Typography>
        </Button>
      </Col>
      {showCreateSpaces && (
        <HalfPageForm
          title="Create new space"
          onClose={handleCloseCreateSpaces}
        >
          <NewSpaceForm onClose={handleCloseCreateSpaces} />
        </HalfPageForm>
      )}
      <ToastContainer />
    </>
  );
};

export default NoRestaurantAddedMessage;
