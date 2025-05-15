import React, { useEffect, useState } from "react";
import Header from "../Header";
import classes from "../styles/clients.module.css";
import RatingChart from "../charts/RatingChart";
import { getReviewRatingReports } from "src/auth/api/requests";

import { startOfMonth, endOfDay, format } from "date-fns";
function Rating() {
  const [date, setDate] = useState<any>({});
  const [index, setIndex] = useState(2);

  const [checkboxStates, setCheckboxStates] = useState({
    general: true,
    food: true,
    service: true,
    price: true,
    atmosphere: true,
  });

  const handleCheckboxChange = (
    type: "general" | "food" | "service" | "price" | "atmosphere"
  ) => {
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [type]: !prevStates[type],
    }));
  };

  const interval: Array<"day" | "week" | "month" | "year"> = [
    "year",
    "month",
    "week",
    "day",
  ];

  const [selectedPeriodType, setSelectedPeriodType] = useState<
    "year" | "month" | "week" | "day"
  >(interval[index]);

  useEffect(() => {
    const atLeastOneChecked = Object.values(checkboxStates).some(
      (state) => state
    );
    if (!atLeastOneChecked) {
      const firstCheckbox = Object.keys(checkboxStates)[0];
      setCheckboxStates((prevStates) => ({
        ...prevStates,
        [firstCheckbox]: true,
      }));
    }
  }, [checkboxStates]);

  const [data, setData] = useState<any>([]);

  const getReviewsData = async (
    startDate: string,
    endDate: string,
    periodType: "day" | "week" | "month" | "year"
  ) => {
    try {
      const response = await getReviewRatingReports(
        startDate,
        endDate,
        periodType
      );
      setData(response["restaurantReviewsRating"]);
      console.log(response["restaurantReviewsRating"]);

      // let totalMissed = 0;
      // let totalCanceled = 0;
      // let totalClosed = 0;
      // let totalReservation = 0;

      // for (const key in response["restaurantReviewsRating"]) {
      //   if (
      //     Object.prototype.hasOwnProperty.call(
      //       response["restaurantReviewsRating"],
      //       key
      //     )
      //   ) {
      //     totalMissed += response["getReservationForRestaurant"][key].missed;
      //     totalCanceled +=
      //       response["getReservationForRestaurant"][key].canceled;
      //     totalClosed += response["getReservationForRestaurant"][key].closed;
      //     totalReservation +=
      //       response["getReservationForRestaurant"][key].total;
      //   }
     
      // }
    } catch (e) {
      console.log(e);
    }
  };


  useEffect(() => {
    if (date.startDate && date.endDate) {
      getReviewsData(date.startDate,date.endDate, selectedPeriodType);
    }
  }, [date, selectedPeriodType]);

  const [dataSet, setDataSet] = useState<any>();
  useEffect(() => {
    if (data) {
      const resultArray = Object.keys(data).map((date) => ({
        date: date,
        ambienceRating: data[date].ambienceRating,
        foodRating: data[date].foodRating,
        priceRating: data[date].priceRating,
        serviceRating: data[date].serviceRating,
        totalRating: data[date].totalRating,
      }));
      setDataSet(resultArray);
      
    }
  }, [data]);

  useEffect(() => {
    const currentDate = new Date();
    const startDate = startOfMonth(currentDate);
    const endDate = endOfDay(currentDate);

    setDate({
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    });
  }, []);

  return (
    <>
      <Header
        setSelectedPeriodType={setSelectedPeriodType}
        title={"Rating"}
        date={date}
        setDate={setDate}
        index={index}
        setIndex={setIndex}
      />
      <div className={classes.ClientsStatisticsBody}>
        <div style={{ height: 798 }} className={classes.Statistics}>
          <div className={classes.StatisticsHeader}>
            <span style={{ fontWeight: 600, fontSize: 20 }}>
              Detailed statistics
            </span>

            <div className={classes.CheckboxContainer}>
              <div>
                <label className={classes.Checkbox}>
                  <input
                    onChange={() => handleCheckboxChange("general")}
                    className={classes.General}
                    type="checkbox"
                    checked={checkboxStates.general}
                  />
                  <span className={classes.Checkmark}></span>
                </label>
                <span>General</span>
              </div>
              <div>
                <label className={classes.Checkbox}>
                  <input
                    onChange={() => handleCheckboxChange("food")}
                    className={classes.Food}
                    type="checkbox"
                    checked={checkboxStates.food}
                  />
                  <span className={classes.Checkmark}></span>
                </label>
                <span>Food</span>
              </div>
              <div>
                <label className={classes.Checkbox}>
                  <input
                    onChange={() => handleCheckboxChange("service")}
                    className={classes.Recurrent}
                    type="checkbox"
                    checked={checkboxStates.service}
                  />
                  <span className={classes.Checkmark}></span>
                </label>
                <span>Service</span>
              </div>
              <div>
                <label className={classes.Checkbox}>
                  <input
                    onChange={() => handleCheckboxChange("price")}
                    className={classes.Price}
                    type="checkbox"
                    checked={checkboxStates.price}
                  />
                  <span className={classes.Checkmark}></span>
                </label>
                <span>Price</span>
              </div>
              <div>
                <label className={classes.Checkbox}>
                  <input
                    onChange={() => handleCheckboxChange("atmosphere")}
                    className={classes.Atmosphere}
                    type="checkbox"
                    checked={checkboxStates.atmosphere}
                  />
                  <span className={classes.Checkmark}></span>
                </label>
                <span>Atmosphere</span>
              </div>
            </div>
          </div>

          <div style={{ height: "740px" }} className={classes.Chart}>
            <RatingChart checkboxStates={checkboxStates} data={dataSet} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Rating;
