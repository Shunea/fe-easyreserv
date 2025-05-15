import React from "react";
import { useLocation } from "react-router-dom";
import classes from "./Image.module.css";
import { useSelector } from "react-redux";
import { StoreType } from "../Types";

const Image = () => {
  const location = useLocation();

  let image = require("../images/buildings.jpg");

  if (location.pathname === "/create-place") {
    image = require("../images/buildings.jpg");
  }
  if (location.pathname === "/create-place/create") {
    image = require("../images/restaurants/restaurant1.jpg");
  }
  if (location.pathname === "/menu/mealSetup") {
    image = require("../images/restaurants/restaurant1.jpg");
  }
  if (
    location.pathname === "/create-place/contacts" ||
    location.pathname === "/edit-place/contacts"
  ) {
    image = require("../images/restaurants/restaurant2.jpg");
  }
  if (
    location.pathname === "/create-place/setup" ||
    location.pathname === "/edit-place/setup"
  ) {
    image = require("../images/restaurants/restaurant4.jpg");
  }
  if (
    location.pathname === "/create-place/images" ||
    location.pathname === "/edit-place/images"
  ) {
    image = require("../images/restaurants/restaurant3.jpg");
  }
  const imageOnHover = useSelector(
    (state: StoreType) => state.backgroundImage.backgroundImage
  );
  return (
    <div
      className={classes.image}
      style={{ backgroundImage: `url(${imageOnHover || image.default})` }}
    ></div>
  );
};
export default Image;
