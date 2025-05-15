import React from "react";
import classes from "./Button.module.css";

const Button = (props: {
  secondary?: boolean,
  disabled?: boolean,
  type?: "button" | "submit" | "reset" | undefined,
  onClick?: any,
  text?: string,
  className?: string,
  icon?: React.ReactNode;
  style?: any
}) => {
  return (
    <button
      className={props.secondary ? classes.button_secondary : classes.button}
      disabled={props.disabled}
      type={props.type}
      onClick={props.onClick}
      style={props.style}
    >
      {props.icon}
      {props.text}
    </button>
  );
};

export default Button;
