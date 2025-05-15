import React, { useEffect, useState } from "react";
import classes from "./PlaceSetup.module.css";
import Title from "../../Title";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../../UI/Input";
import useInput from "../../../hooks/use-input";
import { Col, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../../UI/Button";
import {
  checkIcon,
  crossIcon,
  infoIcon,
  placeIcon,
  plusIcon,
} from "../../../icons/icons";
import { setupStyle } from "../../../UI/selectStyles";
import SimpleSelect from "src/UI/SimpleSelect";
import { durationOptions } from "./selectOptions";
import { SpaceType, StoreType } from "src/Types";
import { createPlaceFormDataActions } from "src/store/formData";
import { useCookies } from "react-cookie";
import { createSpace, deleteOneSpace, editSpace } from "src/auth/api/requests";

const PlaceSetup = (props: { isEditPlace?: boolean }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const placeNamefromRedux = Array.from(
    useSelector((state: StoreType) => state.formData.spaces)
  );
  const placeDetailsfromRedux = useSelector(
    (state: StoreType) => state.formData
  );
  const enteredSpacesFromCookies = Array.from(
    useSelector((state: StoreType) => state.formData.spaces)
  );
  const isEditPlace =
    props.isEditPlace && location.pathname === "/edit-place/setup";
  const [spaces, setSpaces] = useState<SpaceType[] | any>(
    enteredSpacesFromCookies
  );
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
    if (isEditPlace) {
      try {
        editSpace(
          id,
          placeDetailsfromRedux.placeId,
          placeDetailsfromRedux.restaurantId,
          {
            duration: selected.value,
          }
        ).then((val) => {
          let updatedSpaces = spaces.map((el: SpaceType) => {
            if (el.id === id) {
              return {
                ...el,
                duration: selected,
              };
            } else return el;
          });

          setSpaces(updatedSpaces);
          dispatch(
            createPlaceFormDataActions.setSpaces(Array.from(updatedSpaces))
          );
        });
      } catch (err: any) {
        console.error(err);
      }
    } else {
      let updatedSpaces = spaces.map((el: SpaceType) => {
        if (el.id === id) {
          return {
            ...el,
            duration: selected,
          };
        } else return el;
      });

      setSpaces(updatedSpaces);
      dispatch(createPlaceFormDataActions.setSpaces(Array.from(updatedSpaces)));
    }
  };

  const addSpace = () => {
    if (enteredSpaceName !== "") {
      if (isEditPlace) {
        try {
          createSpace(
            placeDetailsfromRedux.placeId,
            placeDetailsfromRedux.restaurantId,
            {
              name: enteredSpaceName,
              duration: enteredDuration.value || 60,
              mainEntityId: placeDetailsfromRedux.placeId,
              restaurantId: placeDetailsfromRedux.restaurantId,
            }
          ).then((createdSpace) => {
            spaces.push({
              id: createdSpace.id,
              name: enteredSpaceName,
              duration: enteredDuration || "1h",
            });
            setSpaces(spaces);
            dispatch(createPlaceFormDataActions.setSpaces(Array.from(spaces)));
            setAddSpaceFormVisible(false);
            resetSpaceName();
          });
        } catch (err: any) {
          console.error(err);
        }
      } else {
        if (spaces)
          spaces.push({
            id: enteredSpaceName + Math.random(),
            name: enteredSpaceName,
            duration: enteredDuration || "1h",
          });
        setSpaces(spaces);
        dispatch(createPlaceFormDataActions.setSpaces(Array.from(spaces)));

        setAddSpaceFormVisible(false);
        resetSpaceName();
      }
    }
    setEnteredDuration({ value: "60", label: "1h" });
  };

  const removeSpace = (id: string) => {
    const updatedPlaces = spaces.filter((place: SpaceType) => place.id !== id);
    setSpaces(updatedPlaces);
    dispatch(createPlaceFormDataActions.setSpaces(Array.from(spaces)));
    if (isEditPlace) {
      try {
        deleteOneSpace(
          placeDetailsfromRedux.placeId,
          placeDetailsfromRedux.restaurantId,
          id
        );
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    dispatch(createPlaceFormDataActions.setSpaces(Array.from(spaces)));
    // if (isEditPlace && cookies.placeId === undefined) {
    //   navigate("/places");
    // }
  }, [spaces]);

  const placesList = spaces.map((place: SpaceType) => {
    return (
      <div key={place.id + place.name}>
        <Row className={classes.place_row}>
          <Col md={12} lg={5} className={classes.place_name}>
            <p>
              <span>{placeIcon}</span>
              {place.name}
            </p>
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
              styles={setupStyle}
              onChange={(selected: any) =>
                editDurationChange(selected, place.id)
              }
              value={place.duration}
              options={durationOptions}
            />
          </Col>
          <Col
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
          </Col>
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

  const title = "Place setup";
  const subtitle = isEditPlace
    ? `Edit spaces and details for created space`
    : `Configure spaces and details for created space`;

  return (
    <div className={classes.PlaceSetup}>
      <Title title={title} subtitle={subtitle} />
      <div>
        <p className={classes.label}>
          Spaces <span>(optional)</span>
        </p>
        <div className={classes.spaces_cotainer}>
          {!addSpaceFormVisible && spaces.length === 0 && (
            <p className={classes.no_spaces}>You have no spaces</p>
          )}
          {spaces.length !== 0 && placesList}
          {addSpaceFormVisible && addPlaceForm}
        </div>
        <div className={classes.spaces_button} onClick={addSpaceForm}>
          <div className={classes.spaces_button_content}>
            <p>
              <span className={classes.plus_icon}>{plusIcon}</span> Create new
              space
            </p>
          </div>
        </div>
      </div>
      <div className={classes.form_buttons}>
        <Link
          to={{
            pathname: isEditPlace
              ? "/edit-place/contacts"
              : "/create-place/contacts",
          }}
        >
          <Button
            text="Save & Continue"
            disabled={false}
            type="submit"
            className={classes.first_button}
          />
        </Link>
        <Link
          to={{
            pathname: isEditPlace
              ? "/edit-place/create"
              : "/create-place/create",
          }}
        >
          <Button text="Back" type={"button"} secondary={true} />
        </Link>
      </div>
    </div>
  );
};

export default PlaceSetup;
