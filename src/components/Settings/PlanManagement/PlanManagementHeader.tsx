import React from "react";
import classes from "./planManagement.module.css";

const PlanManagementHeader = ({activePlan}) => {
  return (
    <div className={`${classes.PlansHeader}`}>
      <h1 className={classes.h1}>Plans</h1>
      <div
        className={`${classes.HeaderCards} ${
          activePlan === "BASIC" ? classes.Active : ""
        }`}
      >
        <h1>Basic</h1>
        <h1 className={classes.HeaderCardsPrice}>
          € 100
          <p>/month</p>
        </h1>
      </div>
      <div
        className={`${classes.HeaderCards} ${
          activePlan === "STANDARD" ? classes.Active : ""
        }`}
      >
        <h1>Standard</h1>
        <h1 className={classes.HeaderCardsPrice}>
          € 350
          <p>/month</p>
        </h1>
      </div>
      <div
        className={`${classes.HeaderCards} ${
          activePlan === "PRO" ? classes.Active : ""
        }`}
      >
        <h1>Pro</h1>
        <h1 className={classes.HeaderCardsPrice}>
          € 600
          <p>/month</p>
        </h1>
      </div>
      <div className={`${classes.HeaderBorder}`}>
        <div
          className={`${classes.HeaderCards} ${
            activePlan === "ENTERPRISE" ? classes.Active : ""
          }`}
        >
          <h1>Enterprise</h1>
          <h1>Custom</h1>
        </div>
      </div>
    </div>
  );
};
export default PlanManagementHeader;
