import React from "react";
import classes from "./Title.module.css";
const Title = (props: {
  title: string;
  subtitle?: string;
  titleClassName?: any;
  subtitleClassName?: any;
  textClassName?: any;
  status?: "closed" | "closing_soon" | "open" | undefined;
}) => {
  return (
    <div className={`${classes.text} ${props.textClassName}`}>
      <h1 className={props.titleClassName}>
        {props.title}
        {props.status && (
          <div
            className={`${classes.statusCircle}
                           ${
                             props.status === "closed"
                               ? classes.statusCircle_closed
                               : ""
                           }
                           ${
                             props.status === "closing_soon"
                               ? classes.statusCircle_closingSoon
                               : ""
                           }
                           ${
                             props.status === "open"
                               ? classes.statusCircle_open
                               : ""
                           }`}
          ></div>
        )}
      </h1>
      <p className={props.subtitleClassName}>{props.subtitle}</p>
    </div>
  );
};
export default Title;
