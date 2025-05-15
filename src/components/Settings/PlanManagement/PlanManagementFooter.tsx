import React from "react";
import classes from "./planManagement.module.css";
import Image from "next/image";
import Upgrade from "../../../assets/Upgrade.svg";
const PlanManagementFooter = ({ activePlan }) => {

  return (
    <div className={`${classes.PlansFooter}`}>
      <div
        className={`${classes.PlansFooterCards} ${
          activePlan === "BASIC"
            ? classes.PlansFooterCurrent
            : classes.PlansFooterUpgrade
        }`}
      >
        {activePlan === "BASIC" ? (
          "Current Plan"
        ) : (
          <>
            Upgrade
            <Image src={Upgrade} alt="upgrade" width={16} height={16} />
          </>
        )}
      </div>
      <div
        className={`${classes.PlansFooterCards} ${
          activePlan === "STANDARD"
            ? classes.PlansFooterCurrent
            : classes.PlansFooterUpgrade
        }`}
      >
        {activePlan === "STANDARD" ? (
          "Current Plan"
        ) : (
          <>
            Upgrade
            <Image src={Upgrade} alt="upgrade" width={16} height={16} />
          </>
        )}
      </div>
      <div
        className={`${classes.PlansFooterCards} ${
          activePlan === "PRO"
            ? classes.PlansFooterCurrent
            : classes.PlansFooterUpgrade
        }`}
      >
        {activePlan === "PRO" ? (
          "Current Plan"
        ) : (
          <>
            Upgrade
            <Image src={Upgrade} alt="upgrade" width={16} height={16} />
          </>
        )}
      </div>
      <div
        className={`${classes.PlansFooterCards} ${
          activePlan === "ENTERPRISE"
            ? classes.PlansFooterCurrent
            : classes.PlansFooterUpgrade
        }`}
      >
        {activePlan === "ENTERPRISE" ? (
          "Current Plan"
        ) : (
          <>
            Upgrade
            <Image src={Upgrade} alt="upgrade" width={16} height={16} />
          </>
        )}
      </div>
    </div>
  );
};
export default PlanManagementFooter;
