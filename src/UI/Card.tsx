import React from "react";
import classes from "./Card.module.css";

const Card = (props: { business: { title: string, icon: string } }) => {
  let business = props.business;

  return (
    <div className={classes.card}>
      <h3> {business.title}</h3>
      <span>{business.icon}</span>
    </div>
  );
};

export default Card;
