import React, { useEffect } from "react";
import classes from "./Form.module.css";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import useInput from "../../../hooks/use-input";
import DragAndDrop from "./DragAndDrop";
import Schedule from "./Schedule";
import Select from "../../../UI/SimpleSelect";
import { useState } from "react";
import { categoriesOptions } from "./options";
import { defaultStyle } from "../../../UI/selectStyles";
import Button from "../../../UI/Button";
import { useSelector } from "react-redux";
import Title from "../../Title";
import { Link, useLocation } from "react-router-dom";
import Input from "../../../UI/Input";
import { createPlaceFormDataActions } from "../../../store/formData";
import { useDispatch } from "react-redux";
import { StoreType } from "../../../Types";
import { getRestaurantById, uploadImage } from "src/auth/api/requests";
const Form = (props: { isEditPlace?: boolean }) => {
  const [isRequired, setIsRequired] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState();
  const location = useLocation();
  const dispatch = useDispatch();
  const [imageFromAWS, setImageFromAWS] = useState("");
  const [existingImage, setExistingImage] = useState(null);
  const enteredCategoryFromRedux = useSelector(
    (state: StoreType) => state.formData.place.category
  );
  const [enteredCategory, setEnteredCategory] = useState(
    enteredCategoryFromRedux
  );
  const isEditPlace =
    props.isEditPlace && location.pathname === "/edit-place/create";
  useEffect(() => {
    setEnteredCategory(enteredCategoryFromRedux);
  }, [enteredCategoryFromRedux]);
  useEffect(() => {
    const storedRestaurant = JSON.parse(
      localStorage.getItem("selectedRestaurant") ?? "null"
    );
    const fetchRestaurantData = async () => {
      try {
        const restaurantData = await getRestaurantById(storedRestaurant.id);

        if (restaurantData.placeId === storedRestaurant.placeId) {
          setSelectedRestaurant(restaurantData);
          const { name, cuisineType, image } = restaurantData;
          savePlaceNameEnteredValue(name);
          const formattedCuisineType = cuisineType.replaceAll("_", " ");
          setEnteredCategory({
            label: formattedCuisineType,
            value: formattedCuisineType,
          });
          const urlParts = image.split("/");
          const imageKey = urlParts[urlParts.length - 1];
          setExistingImage(image);
          setImageFromAWS(imageKey);
        }
      } catch (error) {
        console.error("Error fetching restaurant data", error);
      }
    };

    if (isEditPlace && storedRestaurant) {
      fetchRestaurantData();
    }
  }, [isEditPlace]);

  const enteredPlaceTypeFromRedux = useSelector(
    (state: StoreType) => state.formData.place.type
  );
  const enteredPlaceNameFromRedux = useSelector(
    (state: StoreType) => state.formData.place.name
  );
  const enteredAvatarFromRedux = useSelector(
    (state: StoreType) => state.formData.file
  ); //get from DB
  const enteredImageKeyFromRedux = useSelector(
    (state: StoreType) => state.formData.imageKey
  );
  const scheduleIsValid = useSelector(
    (state: StoreType) => state.formData.scheduleIsValid
  );
  const isNotEmpty = (value: string) => value.trim() !== "";
  const [enteredPlaceNameChanged, setEnteredPlaceNameChanged] = useState(false);
  const {
    value: enteredPlaceName,
    hasError: placeNameInputHasError,
    isValid: enteredPlaceNameIsValid,
    valueChangeHandler: placeNameChangedHandler,
    inputBlurHandler: placeNameBlurHandler,
    saveEnteredValue: savePlaceNameEnteredValue,
  } = useInput(isNotEmpty, "");
  let formIsValid = false;
  const placeNameChangedHandlers = (event) => {
    setEnteredPlaceNameChanged(true);
    placeNameChangedHandler(event);
  };
  useEffect(() => {
    localStorage.setItem("enteredPlaceNameChanged",enteredPlaceNameChanged ? "true" : "false");
  }, [enteredPlaceNameChanged]);
  console.log("🚀 ~ placeNameChangedHandlers ~ enteredPlaceNameChanged:", enteredPlaceNameChanged)
  if (
    enteredPlaceNameIsValid &&
    enteredCategory.length !== 0 &&
    ((isEditPlace && imageFromAWS !== null) ||
      enteredAvatarFromRedux.name !== undefined ||
      enteredImageKeyFromRedux.length !== 0) &&
    scheduleIsValid
  ) {
    formIsValid = true;
  }

  const handleSelectChange = (selected: string) => {
    setEnteredCategory(selected);
    dispatch(createPlaceFormDataActions.setCategory(selected));
  };

  const submitHandler = async (event: Event) => {
    if (!formIsValid) {
      return;
    }
    dispatch(createPlaceFormDataActions.setName(enteredPlaceName));
    if (imageFromAWS) {
      dispatch(createPlaceFormDataActions.setImageKey(imageFromAWS));
    } else {
      const image = new FormData();
      image.append("file", enteredAvatarFromRedux, enteredAvatarFromRedux.name);
      const uploadedImageKey = await uploadImage(image);
      dispatch(createPlaceFormDataActions.setImageKey(uploadedImageKey));
    }
  };
  const selectedPlaceType =
    enteredPlaceTypeFromRedux === undefined ? "" : enteredPlaceTypeFromRedux;
  const title = "General setup";
  const subtitle = isEditPlace
    ? `Edit the general information about the ${selectedPlaceType
        .toLowerCase()
        .replaceAll("_", " ")}`
    : `Provide general information about the ${selectedPlaceType
        .toLowerCase()
        .replaceAll("_", " ")}`;

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  return (
    <div>
      <Title title={title} subtitle={subtitle} />
      <form>
        <div className={classes.draganddrop_container}>
          <DragAndDrop
            actions={createPlaceFormDataActions}
            defaultValue={enteredAvatarFromRedux}
            imageKey={enteredImageKeyFromRedux}
            onFileUpload={handleFileUpload}
            background={existingImage}
            isRequired={isRequired}
          />
        </div>
        <Row className={classes.form_inputs}>
          <Col xs={12} lg={6}>
            <Input
              label="Place name"
              value={enteredPlaceName}
              placeholder={enteredPlaceNameFromRedux || "Enter place name"}
              hasError={placeNameInputHasError}
              errorMessage="Value must not be empty"
              type="text"
              onChange={placeNameChangedHandlers}
              onBlur={placeNameBlurHandler}
            />
          </Col>
          <Col>
            <Select
              styles={defaultStyle}
              label="Category"
              id="category"
              name="category"
              placeholder="Select category"
              options={categoriesOptions}
              onChange={handleSelectChange}
              value={enteredCategory}
            />
          </Col>
        </Row>
        <Row>
          <Schedule />
        </Row>
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
              disabled={!formIsValid}
              type="submit"
              onClick={submitHandler}
            />
          </Link>

          {!isEditPlace && (
            <Link
              to={{
                pathname: "/create-place/plans",
              }}
            >
              <Button text="Back" type={"button"} secondary={true} />
            </Link>
          )}
        </div>
      </form>
    </div>
  );
};
export default Form;
