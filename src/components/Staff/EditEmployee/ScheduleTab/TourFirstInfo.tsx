import { ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import Quantity from "../components/Quantity";
import classes from "./TourFirstInfo.module.css";
import theme from "./theme";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { icon } from "../../../../icons/icons";
import dayjs from "dayjs";

type Props = {
  addedTours: any[];
  handleSetData: (date, endDate, workDays, restDays) => void;
};

const TourFirstInfo = ({ addedTours, handleSetData }: Props) => {
  const WORKING_DAYS_MIN = 1;

  const [workingDaysCount, setWorkingDaysCount] =
    useState<number>(WORKING_DAYS_MIN);
  const [restingDaysCount, setRestingDaysCount] =
    useState<number>(WORKING_DAYS_MIN);
  const [date, setDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const minYear = 1900;
  const maxYear = 2099;
  const maxDate = dayjs(`${maxYear}-12-31`);

  const handleDateChange = (newDate) => {
    const newYear = newDate.year();

    if (newYear >= minYear && newYear <= maxYear) {
      setDate(newDate);
    } else if (newYear < minYear) {
      setDate(newDate.set("year", minYear));
    } else {
      setDate(newDate.set("year", maxYear));
    }
  };
  const handleEndDateChange = (newDate) => {
    const newYear = newDate.year();

    if (newYear >= minYear && newYear <= maxYear) {
      setEndDate(newDate);
    } else if (newYear < minYear) {
      setEndDate(newDate.set("year", minYear));
    } else {
      setEndDate(newDate.set("year", maxYear));
    }
  };

  // Quantity handlers
  const onWorkingDaysIncrementClick = () => {
    setWorkingDaysCount((prevState) => prevState + 1);
  };
  const onWorkingDaysDecrementClick = () => {
    setWorkingDaysCount((prevState) => prevState - 1);
  };
  const onRestingDaysIncrementClick = () => {
    setRestingDaysCount((prevState) => prevState + 1);
  };
  const onRestingDaysDecrementClick = () => {
    setRestingDaysCount((prevState) => prevState - 1);
  };

  useEffect(() => {
    const setData = () => {
      handleSetData(date, endDate, workingDaysCount, restingDaysCount);
    };
    setData();
  }, [date, endDate, workingDaysCount, restingDaysCount]);

  return (
    <div style={{ minWidth: "682px" }}>
      <div className={classes.ScheduleRow}>
        <div className={classes.QuantityGroup}>
          <Quantity
            count={workingDaysCount}
            onIncrementClick={onWorkingDaysIncrementClick}
            onDecrementClick={onWorkingDaysDecrementClick}
            label="Working days"
            minCount={1}
          />
          <Quantity
            count={restingDaysCount}
            onIncrementClick={onRestingDaysIncrementClick}
            onDecrementClick={onRestingDaysDecrementClick}
            label="Resting days"
            minCount={1}
          />
        </div>
      </div>
      <div className={classes.ScheduleRow}>
        <div style={{ width: "100%" }}>
          <ThemeProvider theme={theme}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="en-gb"
            >
              <div className={classes.StartDate}>
                <div className={classes.StartDateLabel}>
                  <label className={classes.StartDateLabelText}>
                    Starting from
                  </label>
                </div>
                <div className={classes.StartDatePicker}>
                  <DesktopDatePicker
                    label="Starting date"
                    slots={{ openPickerIcon: icon }}
                    value={date}
                    onChange={handleDateChange}
                    maxDate={maxDate}
                    className={classes.StartDatePicker}
                  />
                </div>
              </div>
            </LocalizationProvider>
          </ThemeProvider>
        </div>
        <div style={{ width: "100%" }}>
          <ThemeProvider theme={theme}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="en-gb"
            >
              <div className={classes.StartDate}>
                <div className={classes.StartDateLabel}>
                  <label className={classes.StartDateLabelText}>
                    Ending to
                  </label>
                </div>
                <div className={classes.StartDatePicker}>
                  <DesktopDatePicker
                    label="Ending date"
                    slots={{ openPickerIcon: icon }}
                    value={endDate}
                    onChange={handleEndDateChange}
                    maxDate={maxDate}
                    className={classes.StartDatePicker}
                  />
                </div>
              </div>
            </LocalizationProvider>
          </ThemeProvider>
        </div>
      </div>
      {addedTours.length > 0 && addedTours.length !== workingDaysCount ? (
        <p className={classes.ScheduleTourLabel} style={{ padding: "10px" }}>
          The number of working days must be equal to number of added tours
        </p>
      ) : null}
    </div>
  );
};
export default TourFirstInfo;
