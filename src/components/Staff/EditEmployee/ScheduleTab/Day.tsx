import React from "react";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import classes from "./EditEmployeeSchedule.module.css";
import { styled } from "@mui/material";

type DayProps = PickersDayProps<Dayjs> & {
  hasSchedule: boolean;
  schedule?: any[];
};

const Day: React.FC<DayProps> = (props: any) => {
  const { day, hasSchedule, schedule, ...other } = props;

  const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== "hasSchedule",
  })(({ hasSchedule, tourcolor }: any) => ({
    position: "relative",
    ...(hasSchedule && {
      "&::after": {
        content: '""',
        position: "relative",
        top: "8px",
        left: "auto",
        width: 4,
        height: 4,
        borderRadius: "50%",
        backgroundColor: tourcolor,
      },
      "&.MuiPickersDay-root.Mui-selected": {
        backgroundColor: tourcolor,
      },
    }),
  }));
  const dayClassName = hasSchedule
    ? classes.dayWithSchedule
    : classes.dayWithoutSchedule;

  const isHolidayOrDayOff =
    schedule &&
    Array.isArray(props.schedule) &&
    schedule.some(
      (item: any) =>
        dayjs(item.date).isSame(day, "day") &&
        (item.status === "HOLIDAY" || item.status === "DAY_OFF")
    );

  const customDayClassName = isHolidayOrDayOff
    ? classes.dayHolidayOrDayOff
    : dayClassName;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      hasShedule={hasSchedule}
      schedule={schedule}
      className={customDayClassName}
    />
  );
};

export default Day;
