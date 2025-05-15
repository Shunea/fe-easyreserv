import React, { useEffect, useState } from "react";
import classes from "./planManagement.module.css";
import PlanManagementFooter from "./PlanManagementFooter";
import PlanManagementHeader from "./PlanManagementHeader";
import Image from "next/image";
import Info from "../../../assets/InfoSign.svg";
import userData, { UserType } from "./PlanManagementContent";
import { getPlansHistory } from "src/auth/api/requests";

interface PlanManagementProps {}

const PlanManagement: React.FC<PlanManagementProps> = () => {
  const [activePlan, setActivePlan] = useState<string>("");
  useEffect(() => {
    const fetchPlanHistory = async () => {
      try {
        const history = await getPlansHistory();
        const storedRestaurant = JSON.parse(
          localStorage.getItem("selectedRestaurant") ?? "null"
        );

        if (storedRestaurant) {
          const matchedPlan = history.find(
            (item) => item.restaurantId === storedRestaurant.id
          );
          if (matchedPlan) {
            setActivePlan(matchedPlan.planType);
          }
        }
      } catch (error) {
        console.error("Error fetching all plan history:", error);
      }
    };
    fetchPlanHistory();
  }, []);

  const userDataArray: UserType[] = userData;
  return (
    <div className={`${classes.Plans}`}>
      <PlanManagementHeader activePlan={activePlan} />
      <div className={`${classes.PlansContent}`}>
        {userDataArray.map((user, index) => (
          <div
            key={index}
            className={`${classes.UserRow}
             ${activePlan === user.userType ? classes.ActivePlan : ""}
            `}
          >
            <h1
              className={`${classes.ContentType} ${
                user.contentInfo !== null
                  ? classes.ContentTypeText
                  : classes.ContentTypeHeader
              } ${
                user.contentInfo !== null &&
                user.contentInfo.some(
                  (content) => "value" in content && content.value === null
                )
                  ? classes.InfoIcon
                  : ""
              }`}
            >
              {user.userType}
              {user.contentInfo !== null &&
                user.contentInfo.some(
                  (content) => "value" in content && content.value === null
                ) && <Image src={Info} alt="info" width={18} height={18} />}
            </h1>
            {user.contentInfo &&
              user.contentInfo.map((content, idx) => (
                <div
                  key={idx}
                  className={`${classes.ContentInfo}
                  ${activePlan === content.id ? classes.ActiveContent : ""}
                  ${
                    user.userType === "User Types" && activePlan === content.id
                      ? classes.FirstContent
                      : ""
                  }
                  ${
                    user.userType === "Debit / Credit" &&
                    activePlan === content.id
                      ? classes.LastContent
                      : ""
                  }
                  `}
                >
                  {content.type === "text" ? (
                    <span
                      className={
                        content.value === "Unlimited" ? classes.ValueColor : ""
                      }
                    >
                      {content.value}
                    </span>
                  ) : (
                    <Image
                      src={content.src}
                      alt={content.alt}
                      width={20}
                      height={20}
                    />
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
      <PlanManagementFooter activePlan={activePlan} />
    </div>
  );
};
export default PlanManagement;
