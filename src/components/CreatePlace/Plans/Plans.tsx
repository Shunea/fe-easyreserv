import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import classes from "./Plans.module.css";
import { usePlanAnnually } from "../../../hooks/queries/usePlan";
import { usePlanMonthly } from "../../../hooks/queries/usePlan";
import Image from "next/image";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PlanBody } from "../../../auth/types";
import { usePlanOptions } from "./PlanOptions";
import { useTranslation } from "react-i18next";
import sparkles from "../../../assets/sparkles.svg";
import checkmark from "../../../assets/checkmark.svg";
import Button from "../../../UI/Button";
import Title from "src/components/Title";
import { useDispatch, useSelector } from "react-redux";
import { createPlaceFormDataActions } from "../../../store/formData";
import { StoreType } from "src/Types";

const Plans = (props: { isEditPlace?: boolean }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const isEditPlace = props.isEditPlace && location.pathname === "/edit-place";
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const dispatch = useDispatch();

  const { BasicPlanItems, StandardPlanItems, ProPlanItems, UltimatePlanItems } =
    usePlanOptions(t);

  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("annually");
  const checked = selectedPlan === "monthly";
  const [subscriptionPlansAnnually, setSubscriptionPlansAnnually] = useState<
    PlanBody[]
  >([]); // Initialize with an empty array
  const [subscriptionPlansMonthly, setSubscriptionPlansMonthly] = useState<
    PlanBody[]
  >([]); // Initialize with an empty array

  // Fetch data from both hooks and store them initially
  const { data: annualData } = usePlanAnnually();
  const { data: monthlyData } = usePlanMonthly();

  const calculateDiscountedPrices = (plans: PlanBody[]) => {
    const discountPercentage = 0.1;

    return plans.map((plan) => {
      const monthlySubscription =
        typeof plan.price === "string" ? parseFloat(plan.price) : plan.price;
      const discountedMonthly =
        monthlySubscription - monthlySubscription * discountPercentage;
      const savings = monthlySubscription - discountedMonthly;
      const monthlyAmount = discountedMonthly / 12;

      return {
        ...plan,
        price: monthlyAmount,
        savings: savings,
      };
    });
  };
 useEffect(() => {
    setSubscriptionPlansAnnually(calculateDiscountedPrices(annualData || []));
    setSubscriptionPlansMonthly(monthlyData || []); // Ensure it's an array
  }, [annualData, monthlyData]);

  const handleToggle = (selected: "annually" | "monthly") => {
    setSelectedPlan(selected);
  };
  const handleManageClick = (planId: string) => {
    dispatch(createPlaceFormDataActions.setPlanId(planId));
    setActivePlanId(planId);
  };
  const selectedPlanId = useSelector(
    (state: StoreType) => state.formData.planId
  );
  const isPlanSelected = selectedPlanId !== "";
  const title = isEditPlace ? `Edit your Plan` : `Chose you Plan`;
  const subtitle = isEditPlace
    ? "Let's start by editing the plan type"
    : "Let's start by choosing the plan type";
  return (
    <div className={classes.PlansContainer}>
      <div className={classes.SubContainerHeader}>
        <Title title={title} subtitle={subtitle} />
        <div className={classes.SubContainer}>
          <p>{t("PriceSubscriptionSave")}</p>
          <div className={classes.switchesContainer}>
            <input
              type="radio"
              id="switchYearly"
              name="switchPlan"
              value="Yearly"
              checked={!checked}
              onChange={() => handleToggle("annually")}
            />
            <input
              type="radio"
              id="switchMonthly"
              name="switchPlan"
              value="Monthly"
              checked={checked}
              onChange={() => handleToggle("monthly")}
            />
            <label htmlFor="switchYearly">{t("PriceSubscriptionYearly")}</label>
            <label htmlFor="switchMonthly">
              {t("PriceSubscriptionMonthly")}
            </label>
            <div className={classes.switchWrapper}>
              <div className={classes.switch}>
                <div>{t("PriceSubscriptionYearly")}</div>
                <div>{t("PriceSubscriptionMonthly")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.SubscriptionBodyContainer} id="planSelection">
        {selectedPlan === "annually" &&
          subscriptionPlansAnnually?.map((plan, index) => (
            <Card
              key={index}
              className={`${classes.CardContainer} ${
                plan.name === "Basic" || plan.name === "Standard"
                  ? classes.CardContainerTop
                  : ""
              }`}
            >
              {plan.name === "Pro" && (
                <div
                  className={`${classes.MostPopular} ${
                    activePlanId === plan.id ? classes.active : ""
                  }`}
                >
                  <p>{t("PriceSubscriptionMostPopular")}</p>
                  <Image src={sparkles} width={16} height={16} alt="sparkles" />
                </div>
              )}
              <Card.Body
                className={`${
                  plan.name === "Pro" ? classes.ProCard : classes.OtherCard
                } ${
                  activePlanId === plan.id ? classes.active : "" // Apply active class
                }`}
              >
                <div className={classes.CardBodyHeader}>
                  {plan.name === "Basic" && (
                    <div className={`${classes.header} ${classes.headerBasic}`}>
                      <p>{plan.name}</p>
                      <p>{t("PriceSubscriptionCard1FT")}</p>
                    </div>
                  )}
                  {plan.name === "Standard" && (
                    <div
                      className={`${classes.header} ${classes.headerStandard}`}
                    >
                      <p>{plan.name}</p>
                      <p>{t("PriceSubscriptionCard2FT")}</p>
                    </div>
                  )}
                  {plan.name === "Pro" && (
                    <div className={`${classes.header} ${classes.headerPro}`}>
                      <p>{plan.name}</p>
                      <p>{t("PriceSubscriptionCard3FT")}</p>
                    </div>
                  )}
                  <div className={classes.content}>
                    <div className={classes.flexRow}>
                      <h1>€{Math.round(plan.price)}</h1>
                      <p>{t("PriceSubscriptionMonth")}</p>
                      <div className={classes.Saved}>
                        {plan.name === "Basic" && (
                          <p>{t("PriceSubscriptionSavedBasic")}</p>
                        )}
                        {plan.name === "Standard" && (
                          <p>{t("PriceSubscriptionSavedStandard")}</p>
                        )}
                        {plan.name === "Pro" && (
                          <p>{t("PriceSubscriptionSavedPro")}</p>
                        )}
                      </div>
                    </div>
                    <button
                      style={{ marginBottom: "30px" }}
                      onClick={() => handleManageClick(plan.id)}
                    >
                      {t("PriceSubscriptionFree")}
                    </button>
                  </div>
                </div>
                <div className={classes.CardInfo}>
                  <p>{t("PriceSubscriptionCardGet")}</p>
                </div>
                {plan.name === "Basic" && (
                  <ul className={classes.plusList}>
                    {BasicPlanItems.map((item, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <Image
                          src={checkmark}
                          width={24}
                          height={24}
                          alt="checkmark"
                          style={{ marginRight: "5px" }}
                        />
                        <li>{item.text}</li>
                      </div>
                    ))}
                  </ul>
                )}
                {plan.name === "Standard" && (
                  <ul className={classes.plusList}>
                    {StandardPlanItems.map((item, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <Image
                          src={checkmark}
                          width={24}
                          height={24}
                          alt="checkmark"
                          style={{ marginRight: "5px" }}
                        />
                        <li>{item.text}</li>
                      </div>
                    ))}
                  </ul>
                )}
                {plan.name === "Pro" && (
                  <ul className={classes.plusList}>
                    {ProPlanItems.map((item, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <Image
                          src={checkmark}
                          width={24}
                          height={24}
                          alt="checkmark"
                          style={{ marginRight: "5px" }}
                        />
                        <li>{item.text}</li>
                      </div>
                    ))}
                  </ul>
                )}
              </Card.Body>
            </Card>
          ))}
        {selectedPlan === "monthly" &&
          subscriptionPlansMonthly?.map((plan, index) => (
            <Card
              key={index}
              className={`${classes.CardContainer} ${
                plan.name === "Basic" || plan.name === "Standard"
                  ? classes.CardContainerTop
                  : ""
              }`}
            >
              {plan.name === "Pro" && (
                <div
                  className={`${classes.MostPopular} ${
                    activePlanId === plan.id ? classes.active : ""
                  }`}
                >
                  <p>{t("PriceSubscriptionMostPopular")}</p>
                  <Image src={sparkles} width={16} height={16} alt="sparkles" />
                </div>
              )}
              <Card.Body
                className={`${
                  plan.name === "Pro" ? classes.ProCard : classes.OtherCard
                } ${
                  activePlanId === plan.id ? classes.active : "" // Apply active class
                }`}
              >
                <div className={classes.CardBodyHeader}>
                  {plan.name === "Basic" && (
                    <div className={`${classes.header} ${classes.headerBasic}`}>
                      <p>{plan.name}</p>
                      <p>{t("PriceSubscriptionCard1FT")}</p>
                    </div>
                  )}
                  {plan.name === "Standard" && (
                    <div
                      className={`${classes.header} ${classes.headerStandard}`}
                    >
                      <p>{plan.name}</p>
                      <p>{t("PriceSubscriptionCard2FT")}</p>
                    </div>
                  )}
                  {plan.name === "Pro" && (
                    <div className={`${classes.header} ${classes.headerPro}`}>
                      <p>{plan.name}</p>
                      <p>{t("PriceSubscriptionCard3FT")}</p>
                    </div>
                  )}
                  <div className={classes.content}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <h1>${Math.round(plan.price)}</h1>
                      <p>{t("PriceSubscriptionMonth")}</p>
                    </div>
                    <button
                      style={{ marginBottom: "30px" }}
                      onClick={() => handleManageClick(plan.id)}
                    >
                      {t("PriceSubscriptionFree")}
                    </button>
                  </div>
                </div>
                <div className={classes.CardInfo}>
                  <p>{t("PriceSubscriptionCardGet")}</p>
                </div>
                {plan.name === "Basic" && (
                  <ul className={classes.plusList}>
                    {BasicPlanItems.map((item, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <Image
                          src={checkmark}
                          width={24}
                          height={24}
                          alt="checkmark"
                          style={{ marginRight: "5px" }}
                        />
                        <li>{item.text}</li>
                      </div>
                    ))}
                  </ul>
                )}
                {plan.name === "Standard" && (
                  <ul className={classes.plusList}>
                    {StandardPlanItems.map((item, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <Image
                          src={checkmark}
                          width={24}
                          height={24}
                          alt="checkmark"
                          style={{ marginRight: "5px" }}
                        />
                        <li>{item.text}</li>
                      </div>
                    ))}
                  </ul>
                )}
                {plan.name === "Pro" && (
                  <ul className={classes.plusList}>
                    {ProPlanItems.map((item, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <Image
                          src={checkmark}
                          width={24}
                          height={24}
                          alt="checkmark"
                          style={{ marginRight: "5px" }}
                        />
                        <li>{item.text}</li>
                      </div>
                    ))}
                  </ul>
                )}
              </Card.Body>
            </Card>
          ))}
        <Card
          className={`${classes.CardContainer} ${classes.CardContainerTop} ${classes.OtherCard}`}
        >
          <Card.Body className={classes.CardBody}>
            <div className={classes.CardBodyHeader}>
              <div className={classes.header}>
                <p>{t("PriceSubscriptionEnterprise")}</p>
                <p>{t("PriceSubscriptionCard4FT")}</p>
              </div>
              <div className={classes.content}>
                <h1>{t("PriceSubscriptionCard4Custom")}</h1>
                <button>{t("PriceSubscriptionFree")}</button>
              </div>
            </div>
            <div className={classes.CardInfo}>
              <p>{t("PriceSubscriptionCardGet")}</p>
            </div>
            <ul className={classes.plusList} style={{ top: "30px" }}>
              {UltimatePlanItems.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Image
                    src={checkmark}
                    width={24}
                    height={24}
                    alt="checkmark"
                    style={{ marginRight: "5px" }}
                  />
                  <li>{item.text}</li>
                </div>
              ))}
            </ul>
          </Card.Body>
        </Card>
      </div>
      <div className={classes.buttonContainer}>
        <Link to={"/create-place/create"}>
          <Button
            text="Save & Continue"
            disabled={!isPlanSelected}
          />
        </Link>
        {!isEditPlace && (
          <Link
            to={{
              pathname: "/create-place",
            }}
          >
            <Button text="Back" type={"button"} secondary={true} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Plans;
