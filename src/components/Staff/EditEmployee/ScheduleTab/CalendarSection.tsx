import { ThemeProvider, Typography } from "@mui/material";
import React, { useState } from "react";
import theme from "./theme";
import classes from "./EditEmployeeSchedule.module.css";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Employee, TourType } from "../../StaffTypes";
import renderDay from "./CustomPickersDay";
import CalendarSectionNoEditMode from "./CalendarSectionNoEditMode";
import CalendarSectionEditMode from "./CalendarSectionEditMode";

type Props = {
  employee: Employee;
  tours: any;
  startTimes: any[];
  setStartTimes: (updatedStartTimes: Array<any>) => void;
  endTimes: any[];
  setEndTimes: (updatedEndimes: Array<any>) => void;
  tourNames: any[];
  setTourNames: (updatedTourNames: Array<any>) => void;
  setSelectedTour: (tour) => void;
  setChangingTour: (tour) => void;
};

const CalendarSection = (props: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const [generatedCards] = useState<any[]>([]);

  function getUniqueTourTitles(tours) {
    const uniqueTitles = new Set();
    return tours.reduce((result, tour) => {
      if (!uniqueTitles.has(tour.title)) {
        uniqueTitles.add(tour.title);
        result.push(tour.title);
      }
      return result;
    }, []);
  }

  const [value, setValue] = useState<any>(null);

  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
  };

  const [startTime, setStartTime] = useState<any>(null);
  const [endTime, setEndTime] = useState<any>(null);

  const handleStartTimeChange = (selectedOption: any, tourId: number) => {
    const updatedStartTimes = [...props.startTimes];
    updatedStartTimes[tourId - 1] = selectedOption.value;
    props.setStartTimes(updatedStartTimes);
    setStartTime(selectedOption.value);
    props.setSelectedTour((prevTour) => ({
      ...prevTour,
      startTime: selectedOption.value, // Replace newStartTime with the new value
    }));
  };
  const handleEndTimeChange = (selectedOption: any, tourId: number) => {
    const updatedEndTimes = [...props.endTimes];
    updatedEndTimes[tourId - 1] = selectedOption.value;
    props.setEndTimes(updatedEndTimes);
    setEndTime(selectedOption.value);
    props.setSelectedTour((prevTour) => ({
      ...prevTour,
      endTime: selectedOption.value, // Replace newStartTime with the new value
    }));
  };

  const [schedules, setSchedules] = useState<TourType[]>([]);
  const [tourName, setTourName] = useState<string>("");

  const handleCalendarChange = (newValue: any) => {
    setValue(newValue);

    if (props.employee && props.tours !== null) {
      const filteredSchedule = props.tours.filter((item: any) =>
        dayjs(item.date).isSame(dayjs(newValue), "day")
      );
      setSchedules(filteredSchedule);

      const selectedDateSchedule = filteredSchedule.find(
        (item: any) => item.status === "WORKING"
      );

      if (selectedDateSchedule) {
        setStartTime(selectedDateSchedule.startTime);
        setEndTime(selectedDateSchedule.endTime);

        const tourForSelectedDate = props.tours.find(
          (item: any) =>
            dayjs(item.date).isSame(dayjs(newValue), "day") &&
            item.status === "WORKING"
        );

        setTourName(tourForSelectedDate?.title || "");
      } else {
        setStartTime(null);
        setEndTime(null);
        setTourName("");
      }
    } else {
      setSchedules([]);
      setStartTime(null);
      setEndTime(null);
      setTourName("");
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className={classes.EditEmployeeAccordion}>
          <div className={classes.EditEmployeeAccordionSummary}>
            <Typography className={classes.EditEmployeeAccordionSummaryText}>
              Work schedule
            </Typography>
          </div>
          <div className={classes.EditEmployeeAccordionDetails}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="en-gb"
            >
              <DateCalendar
                className={classes.EditEmployeeCalendar}
                dayOfWeekFormatter={(day: any) => `${day}`}
                value={value ? value : null}
                onChange={handleCalendarChange}
                showDaysOutsideCurrentMonth={true}
                onMonthChange={handleMonthChange}
                slots={{
                  day: (slotProps) =>
                    renderDay({ ...slotProps, ...props.employee }, props.tours),
                }}
              />
            </LocalizationProvider>
            <div className={classes.EditEmployeeCalendarList}>
              {value !== null && (
                <div className={classes.SelectedDate}>
                  {value.format("DD MMMM YYYY, dddd")}
                </div>
              )}

              {value === null && generatedCards.length === 0 && (
                <div className={classes.CalendarPlaceholder}>
                  <span>Select a day for details</span>
                </div>
              )}

              {value !== null && schedules && schedules.length > 0
                ? schedules.map((item: any, index) => (
                    <React.Fragment key={index}>
                      {item.status === "HOLIDAY" && (
                        <div className={classes.NoScheduleAvaliable}>
                          <span className={classes.NoScheduleMessage}>
                            Employee isn’t working this day
                          </span>
                        </div>
                      )}
                    </React.Fragment>
                  ))
                : null}

              {value !== null && schedules.length > 0
                ? schedules.map((item: any, index) => (
                    <React.Fragment key={index}>
                      {item.status === "DAY_OFF" && (
                        <div className={classes.NoScheduleAvaliable}>
                          <span className={classes.NoScheduleMessage}>
                            Day-Off
                          </span>
                        </div>
                      )}
                    </React.Fragment>
                  ))
                : null}

              {isEditMode && (
                <CalendarSectionEditMode
                  employee={props.employee}
                  tours={props.tours}
                  value={value}
                  tourName={tourName}
                  setTourName={setTourName}
                  startTime={startTime}
                  setStartTime={setStartTime}
                  handleStartTimeChange={handleStartTimeChange}
                  endTime={endTime}
                  setEndTime={setEndTime}
                  HandleEndTimeChange={handleEndTimeChange}
                  tourNames={props.tourNames}
                  setTourNames={props.setTourNames}
                  schedules={schedules}
                  setIsEditMode={setIsEditMode}
                  setSelectedTour={props.setSelectedTour}
                  setChangingTour={props.setChangingTour}
                />
              )}

              {!isEditMode && value !== null && schedules.length > 0 && (
                <CalendarSectionNoEditMode
                  schedules={schedules}
                  tours={props.tours}
                  value={value}
                  setIsEditMode={setIsEditMode}
                />
              )}

              {value !== null &&
                schedules.length === 0 &&
                generatedCards.length === 0 && (
                  <div className={classes.NoScheduleAvaliable}>
                    <span className={classes.NoScheduleMessage}>
                      No schedule available
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};
export default CalendarSection;
