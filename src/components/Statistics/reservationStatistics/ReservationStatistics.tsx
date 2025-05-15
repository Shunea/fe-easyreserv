import React, { useEffect, useState } from "react";
import clients from "../styles/clients.module.css";
import statistics from "../styles/statistics.module.css";
import {
  canceledReservationsIcon,
  questionMarkIcon,
  servedReservationsIcon,
  totalReservationsIcon,
} from "src/icons/icons";
import ReservationsChart from "../charts/ReservationsChart";
import Header from "../Header";
import { getReservationReports, getReservations } from "src/auth/api/requests";
import { startOfMonth, endOfDay, format } from "date-fns";

// const data = [
//   {
//     date: "Page A",
//     missed: 120,
//     canceled: 130,
//     closed: 3000,
//   },
//   {
//     date: "Page A",
//     missed: 10,
//     canceled: 3,
//     closed: 3400,
//   },
//   {
//     date: "Page A",
//     missed: 213,
//     canceled: 135,
//     closed: 3600,
//   },
//   {
//     date: "Page A",
//     missed: 230,
//     canceled: 330,
//     closed: 3000,
//   },
//   {
//     date: "Page A",
//     missed: 135,
//     canceled: 440,
//     closed: 2400,
//   },
// ];

const ReservationStatistics = () => {
  const [total, setTotal] = useState({
    reservations: 0,
    missed: 0,
    canceled: 0,
    closed: 0,
  });

  const interval: Array<"day" | "week" | "month" | "year"> = [
    "year",
    "month",
    "week",
    "day",
  ];
  const [index, setIndex] = useState(2);

  const [selectedPeriodType, setSelectedPeriodType] = useState<
    "year" | "month" | "week" | "day"
  >(interval[index]);

  const [date, setDate] = useState<any>({});

  const [checkboxStates, setCheckboxStates] = useState({
    missed: true,
    canceled: true,
    served: true,
  });

  const handleCheckboxChange = (type: "missed" | "canceled" | "served") => {
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [type]: !prevStates[type],
    }));
  };

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

  const getReservationsData = async (
    startDate: string,
    endDate: string,
    periodType: "day" | "week" | "month" | "year"
  ) => {
    try {
      const response = await getReservationReports(
        startDate,
        endDate,
        periodType
      );
      setData(response["getReservationForRestaurant"]);
      let totalMissed = 0;
      let totalCanceled = 0;
      let totalClosed = 0;
      let totalReservation = 0;

      for (const key in response["getReservationForRestaurant"]) {
        if (
          Object.prototype.hasOwnProperty.call(
            response["getReservationForRestaurant"],
            key
          )
        ) {
          totalMissed += response["getReservationForRestaurant"][key].missed;
          totalCanceled +=
            response["getReservationForRestaurant"][key].canceled;
          totalClosed += response["getReservationForRestaurant"][key].closed;
          totalReservation +=
            response["getReservationForRestaurant"][key].total;
        }
        setTotal({
          reservations: totalReservation,
          canceled: totalCanceled,
          closed: totalClosed,
          missed: totalMissed,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (date.startDate && date.endDate) {
      getReservationsData(date.startDate, date.endDate, selectedPeriodType);
    }
  }, [date, selectedPeriodType]);

  const [data, setData] = useState<any>([]);

  const [dataSet, setDataSet] = useState<any>();
  useEffect(() => {
    if (data) {
      const resultArray = Object.keys(data).map((date) => ({
        date: date,
        missed: data[date].missed,
        closed: data[date].closed,
        canceled: data[date].canceled,
        total: data[date].total,
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
        index={index}
        setIndex={setIndex}
        date={date}
        setDate={setDate}
        title={"Reservations"}
      />
      <div className={clients.ClientsStatisticsBody}>
        <span className={clients.Title}>Overall statistics</span>
        <div className={clients.Cards}>
          <div
            className={clients.Card}
            style={{ background: "rgba(254, 152, 0, 0.15)" }}
          >
            <div className={statistics.IconContainer}>
              <div className={statistics.IconControl}>
                <span className={statistics.Icon}>{totalReservationsIcon}</span>
              </div>
            </div>
            <div className={clients.Info}>
              <span className={clients.Value}>{total.reservations}</span>
              <span>total reservations</span>
            </div>
          </div>
          <div
            className={clients.Card}
            style={{ background: "rgba(33, 103, 209, 0.2)" }}
          >
            <div className={statistics.IconContainer}>
              <div className={statistics.IconControl}>
                <span className={statistics.Icon}>{questionMarkIcon}</span>
              </div>
            </div>
            <div className={clients.Info}>
              <span className={clients.Value}>{total.missed}</span>
              <span>missed reservations</span>
            </div>
          </div>
          <div
            className={clients.Card}
            style={{ background: "rgba(242, 54, 54, 0.2)" }}
          >
            <div className={statistics.IconContainer}>
              <div className={statistics.IconControl}>
                <span className={statistics.Icon}>
                  {canceledReservationsIcon}
                </span>
              </div>
            </div>{" "}
            <div className={clients.Info}>
              <span className={clients.Value}>{total.canceled}</span>
              <span>canceled reservations</span>
            </div>
          </div>
          <div
            className={clients.Card}
            style={{ background: "rgba(54, 186, 242, 0.2)" }}
          >
            <div className={statistics.IconContainer}>
              <div className={statistics.IconControl}>
                <span className={statistics.Icon}>
                  {" "}
                  {servedReservationsIcon}
                </span>
              </div>
            </div>
            <div className={clients.Info}>
              <span className={clients.Value}>{total.closed}</span>
              <span>served reservations</span>
            </div>
          </div>
          <div
            className={clients.Card}
            style={{ background: "rgba(54, 186, 242, 0.2)" }}
          >
            <div className={statistics.IconContainer}>
              <div className={statistics.IconControl}>
                <span className={statistics.Icon}>
                  {" "}
                  {servedReservationsIcon}
                </span>
              </div>
            </div>
            <div className={clients.Info}>
              <span className={clients.Value}>
                {total.reservations-(total.closed+total.missed+total.canceled)}
              </span>
              <span>other reservations</span>
            </div>
          </div>
        </div>
        <div className={clients.Statistics}>
          <div className={clients.StatisticsHeader}>
            <span style={{ fontWeight: 600, fontSize: 20 }}>
              Detailed statistics
            </span>
            <div className={clients.CheckboxContainer}>
              <div>
                <label className={clients.Checkbox}>
                  <input
                    onChange={() => handleCheckboxChange("missed")}
                    className={clients.Unique}
                    type="checkbox"
                    checked={checkboxStates.missed}
                  />
                  <span className={clients.Checkmark}></span>
                </label>
                <span>Missed</span>
              </div>
              <div>
                <label className={clients.Checkbox}>
                  <input
                    onChange={() => handleCheckboxChange("canceled")}
                    className={clients.Canceled}
                    type="checkbox"
                    checked={checkboxStates.canceled}
                  />
                  <span className={clients.Checkmark}></span>
                </label>
                <span>Canceled</span>
              </div>
              <div>
                <label className={clients.Checkbox}>
                  <input
                    onChange={() => handleCheckboxChange("served")}
                    className={clients.Recurrent}
                    type="checkbox"
                    checked={checkboxStates.served}
                  />
                  <span className={clients.Checkmark}></span>
                </label>
                <span>Served</span>
              </div>
            </div>
          </div>

          <div className={clients.Chart}>
            <ReservationsChart checkboxStates={checkboxStates} data={dataSet} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationStatistics;
