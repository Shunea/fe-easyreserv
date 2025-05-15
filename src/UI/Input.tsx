import React from "react";

import classes from "./Input.module.css";
const Input = (props: {
  className?: any;
  onInput?: any;
  onKeyDown?: any;
  pattern?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  onChange?: any;
  onBlur?: any;
  value?: string;
  hasError?: boolean;
  errorMessage?: string;
}) => {
  return (
    <div className={classes.form_inputs}>
      <p className={classes.label}>{props.label}</p>
      <input
        onInput={props.onInput}
        onKeyDown={props.onKeyDown}
        pattern={props.pattern}
        placeholder={props.placeholder}
        className={`${classes.input} ${props.className}`}
        type={props.type}
        id={props.label}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
      />
      <p className={classes.error}>
        {props.hasError ? `${props.errorMessage}` : " "}
      </p>
    </div>
  );
};
export default Input;
