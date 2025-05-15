import React, { useEffect, useState } from "react";
import classes from "../styles/clients.module.css";
import {
  arrowLeftIcon,
  clientsIcon,
  diamondIcon,
  heartIcon,
  arrowRightIcon,
} from "src/icons/icons";
import { getClientsReports } from "src/auth/api/requests";
import ClientsChart from "../charts/ClientsChart";
import { useNavigate } from "react-router-dom";
import { startOfMonth, endOfDay, format } from "date-fns";
import Header from "../Header";

const ClientsStatistics: React.FC = () => {
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
    unique: true,
    recurrent: true,
  });

  const handleCheckboxChange = (type: "unique" | "recurrent") => {
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [type]: !prevStates[type],
    }));
  };
  const [total, setTotal] = useState({ clients: 0, recurrent: 0, unique: 0 });

  async function getClientsData(
    startDate: string,
    endDate: string,
    periodType: "day" | "week" | "month" | "year"
  ) {
    try {
      const response = await getClientsReports(startDate, endDate, periodType);
      let totalRecurrent = 0;
      let totalUnique = 0;

      for (const key in response["clientsTotalsForRestaurant"]) {
        if (
          Object.prototype.hasOwnProperty.call(
            response["clientsTotalsForRestaurant"],
            key
          )
        ) {
          totalRecurrent +=
            response["clientsTotalsForRestaurant"][key].recurrent;
          totalUnique += response["clientsTotalsForRestaurant"][key].unique;
        }
      }
      setTotal({
        clients: totalRecurrent + totalUnique,
        recurrent: totalRecurrent,
        unique: totalUnique,
      });
      setData(response["clientsTotalsForRestaurant"]);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (date.startDate && date.endDate) {
      getClientsData(date.startDate, date.endDate, selectedPeriodType);
    }
  }, [date, selectedPeriodType]);

  const [data, setData] = useState<any>();
  const [dataSet, setDataSet] = useState<any>();

  useEffect(() => {
    if (data) {
      const resultArray = Object.keys(data).map((date) => ({
        date: date,
        unique: data[date].unique,
        recurrent: data[date].recurrent,
      }));
      setDataSet(resultArray);
    }
  }, [data, setSelectedPeriodType]);

  const navigate = useNavigate();

  useEffect(() => {
    const currentDate = new Date();
    const startDate = startOfMonth(currentDate);
    const endDate = endOfDay(currentDate);

    setDate({
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    });
  }, []);


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

  return (
    <>
      <div className={classes.ClientsContainer}>
        <Header
          setSelectedPeriodType={setSelectedPeriodType}
          index={index}
          setIndex={setIndex}
          title={"Clients"}
          setDate={setDate}
          date={date}
        />
        <div className={classes.ClientsStatisticsBody}>
          <span className={classes.Title}>Overall statistics</span>

          <div className={classes.Cards}>
            <div
              className={classes.Card}
              style={{ background: "rgba(18, 102, 79, 0.1)" }}
            >
              {clientsIcon}
              <div className={classes.Info}>
                <span className={classes.Value}>{total.clients}</span>
                <span>total clients</span>
              </div>
            </div>
            <div
              className={classes.Card}
              style={{ background: "rgba(5, 110, 198, 0.2)" }}
            >
              {diamondIcon}
              <div className={classes.Info}>
                <span className={classes.Value}>{total.unique}</span>
                <span>unique clients</span>
              </div>
            </div>
            <div
              className={classes.Card}
              style={{ background: "rgba(54, 186, 242, 0.2)" }}
            >
              {heartIcon}
              <div className={classes.Info}>
                <span className={classes.Value}>{total.recurrent}</span>
                <span>recurrent clients</span>
              </div>
            </div>
          </div>
          <div className={classes.Statistics}>
            <div className={classes.StatisticsHeader}>
              <span style={{ fontWeight: 600, fontSize: 20 }}>
                Detailed statistics
              </span>
              <div className={classes.CheckboxContainer}>
                <div>
                  <label className={classes.Checkbox}>
                    <input
                      onChange={() => handleCheckboxChange("unique")}
                      type="checkbox"
                      checked={checkboxStates.unique}
                      className={classes.Unique}

                    />
                    <span className={classes.Checkmark}></span>
                  </label>
                  <span>Unique</span>
                </div>
                <div>
                  <label className={classes.Checkbox}>
                    <input
                      
                      className={classes.Recurrent}
                      onChange={() => handleCheckboxChange("recurrent")}
                      type="checkbox"
                      checked={checkboxStates.recurrent}
                    />
                    <span className={classes.Checkmark}></span>
                  </label>
                  <span>Recurrent</span>
                </div>
              </div>
            </div>

            <div className={classes.Chart}>
              <ClientsChart checkboxStates={checkboxStates} data={dataSet} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientsStatistics;
