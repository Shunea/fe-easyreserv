import React, { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import classes from "./spaceSelect.module.css";
import { infoIcon, plusIcon } from "src/icons/icons";
import { Col, Row } from "react-bootstrap";
import SimpleSelect from "src/UI/SimpleSelect";
import { setupStyle } from "src/UI/selectStyles";
import Title from "../../Title";
import { useDispatch } from "react-redux";
import Input from "src/UI/Input";
import useInput from "src/hooks/use-input";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { checkIcon, crossIcon, placeIcon } from "src/icons/icons";
import { durationOptions } from "./selectOptions";
import { SpaceType } from "src/Types";
import { createPlaceFormDataActions } from "src/store/formData";
import {
  createSpace,
  deleteOneSpace,
  editSpace,
  getAllAboutPlaces,
  getSpaces,
} from "src/auth/api/requests";

const SpaceSelect = ({  currentSpaceId }) => {
  // const dispatch = useDispatch();
  const location = useLocation();

  function onChange(i, placeId) {
    setSelected(placeId);
    // callback(placeId);
  }
  const [spaces, setSpaces] = useState<SpaceType[] | any>([]);

  const [selectedRestaurant, setSelectedRestaurant] = useState();
  const storedRestaurant = JSON.parse(
    localStorage.getItem("selectedRestaurant") ?? "null"
  );

  const fetchSpaces = async () => {
    if (storedRestaurant) {
      // const selectedRestaurantFromCookie = storedRestaurant;
      setSelectedRestaurant(storedRestaurant);
      getSpaces(storedRestaurant.id).then((spaces) => {
        //current restaurant
        let spacesWithFixedDurationFromDB = [];
        if (spaces != undefined) {
          spacesWithFixedDurationFromDB = spaces.map((space: any) => {
            if (typeof space.duration === "number") {
              var hours = space.duration / 60;
              var rhours = Math.floor(hours);
              var minutes = (hours - rhours) * 60;
              var rminutes = Math.round(minutes);
              return {
                ...space,
                duration: {
                  value: space.duration,
                  label: `${rhours === 0 ? "" : `${rhours}h`}${
                    rminutes === 0 ? "" : `${rminutes}min`
                  }`,
                },
              };
            }
          });
        }
        if (spacesWithFixedDurationFromDB.length > 0) {
          setSpaces(spacesWithFixedDurationFromDB);
          // callback(spacesWithFixedDurationFromDB[0]["id"]);
        }
      });
    }
  };
  useEffect(() => {
    fetchSpaces();

    // Fetch spaces when the component mounts
  }, []);

  const [selected, setSelected] = useState(currentSpaceId);

  const [enteredDuration, setEnteredDuration] = useState({
    value: "60",
    label: "1h",
  });
  const [addSpaceFormVisible, setAddSpaceFormVisible] = useState(false);
  const isNotEmpty = (value: string) => value.trim() !== "";
  const navigate = useNavigate();

  const {
    value: enteredSpaceName,
    hasError: spaceNameInputHasError,
    // isValid: enteredSpaceNameIsValid,
    valueChangeHandler: spaceNameChangedHandler,
    inputBlurHandler: spaceNameBlurHandler,
    // saveEnteredValue: saveSpaceNameEnteredValue,
    reset: resetSpaceName,
  } = useInput(isNotEmpty, "");

  const handleDurationChange = (selected: { value: string; label: string }) => {
    setEnteredDuration(selected);
  };

  const addSpaceForm = () => {
    setAddSpaceFormVisible(true);
  };

  const removeSpaceForm = () => {
    setAddSpaceFormVisible(false);
    resetSpaceName();
  };

  const editDurationChange = (
    selected: { value: string; label: string },
    id: string
  ) => {
    let updatedSpaces = spaces.map((el: SpaceType) => {
      if (el.id === id) {
        return {
          ...el,
          duration: selected,
        };
      } else return el;
    });

    setSpaces(updatedSpaces);
    // dispatch(createPlaceFormDataActions.setSpaces(Array.from(spaces)));
  };

  const addSpace = () => {
    if (enteredSpaceName !== "") {
      if (spaces)
        spaces.push({
          id: enteredSpaceName + Math.random(),
          name: enteredSpaceName,
          duration: enteredDuration || "1h",
        });
      setSpaces(spaces);
      // dispatch(createPlaceFormDataActions.setSpaces(Array.from(spaces)));
      // setCookie("placeSpaces", Array.from(spaces)/*, { path: isEditPlace ? "/edit-place" : "/create-place" }*/);
      setAddSpaceFormVisible(false);
      resetSpaceName();
    }
    setEnteredDuration({ value: "60", label: "1h" });
  };

  const removeSpace = (id: string) => {
    const updatedPlaces = spaces.filter((place: SpaceType) => place.id !== id);
    setSpaces(updatedPlaces);
    // dispatch(createPlaceFormDataActions.setSpaces(Array.from(spaces)));
    // setCookie("placeSpaces", Array.from(spaces)/*, { path: isEditPlace ? "/edit-place" : "/create-place" }*/);
  };

  const placesList = spaces.map((place: SpaceType, i) => {
    return (
      <div key={place.id + place.name}>
        <Row className={classes.place_row}>
          <Col sm={1} lg={1} className={classes.place_name}>
            <p>
              <input
                type="checkbox"
                className="form-check-input"
                id={place.id + place.name}
                name={"Space"}
                checked={place.id === selected}
                onChange={() => onChange(i, place.id)}
              />
            </p>
          </Col>
          <Col sm={5} lg={6} className={classes.place_name}>
            <label htmlFor={place.id + place.name}>
              <p>{place.name}</p>
            </label>
          </Col>
          <Col
            xs={3}
            sm={3}
            md={3}
            lg={3}
            className={`${classes.add_place_col} ${classes.duration_container}`}
          >
            <div className={classes.duration_label}>
              <p>
                <span>Duration </span>
                <i
                  title="This will be the default duration of the
                reservation for this space in the app"
                >
                  {infoIcon}
                </i>
              </p>
            </div>
          </Col>
          <Col
            className={`${classes.add_place_col} ${classes.select_container}`}
          >
            <SimpleSelect
              disabled={true}
              styles={setupStyle}
              onChange={(selected: any) =>
                editDurationChange(selected, place.id)
              }
              value={place.duration}
              options={durationOptions}
            />
          </Col>
          {/* <Col
            xs={4}
            sm={12}
            md={3}
            lg={2}
            className={`${classes.add_place_col} ${classes.buttons_col}`}
          >
            <div
              className={classes.deny_button}
              onClick={() => removeSpace(place.id)}
            >
              {crossIcon}
            </div>
          </Col> */}
        </Row>
      </div>
    );
  });

  const addPlaceForm = (
    <div className={classes.add_place}>
      <Row className={classes.add_place_row}>
        <Col md={12} lg={5} className={classes.add_place_col}>
          <Input
            value={enteredSpaceName}
            hasError={spaceNameInputHasError}
            errorMessage=""
            type="text"
            onChange={spaceNameChangedHandler}
            onBlur={spaceNameBlurHandler}
            className={classes.spaces_input}
            placeholder="Enter space name"
          />
        </Col>
        <Col
          xs={5}
          sm={6}
          md={5}
          lg={3}
          className={`${classes.add_place_col} ${classes.duration_container}`}
        >
          <div className={classes.duration_label}>
            <p>
              <span>Duration </span>
              {infoIcon}
            </p>{" "}
          </div>
        </Col>
        <Col className={`${classes.add_place_col} ${classes.select_container}`}>
          <SimpleSelect
            styles={setupStyle}
            placeholder="1h"
            options={durationOptions}
            onChange={handleDurationChange}
            value={enteredDuration}
          />
        </Col>
        <Col
          xs={4}
          sm={12}
          md={3}
          lg={2}
          className={`${classes.add_place_col} ${classes.buttons_col}`}
        >
          <div className={classes.deny_button} onClick={removeSpaceForm}>
            {crossIcon}
          </div>
          <div className={classes.accept_button} onClick={addSpace}>
            {checkIcon}
          </div>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className={classes.PlaceSetup}>
      <div>
        <p className={classes.label}>Spaces</p>
        <div className={classes.spaces_cotainer}>
          {!addSpaceFormVisible && spaces.length === 0 && (
            <p className={classes.no_spaces}>You have no spaces</p>
          )}
          {spaces.length !== 0 && placesList}
          {/* {addSpaceFormVisible && addPlaceForm} */}
        </div>
        {/* <div className={classes.spaces_button} onClick={addSpaceForm}>
          <div className={classes.spaces_button_content}>
            <p>
              <span className={classes.plus_icon}>{plusIcon}</span> Create new
              space
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SpaceSelect;
