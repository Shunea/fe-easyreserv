// CustomPickersDay.tsx
import { styled } from "@mui/material/styles";
import { PickersDay } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function mapColorToShade(colorName: string) {
  const colorShades: { [key: string]: string } = {
    GREEN: "#4BE248",
    BLUE: "#36BAF2",
    RED: "#ff1a1a",
    YELLOW: "#ffff00",
    GREY: "#d1cccc",
    ORANGE: "#ff9900",
    BLACK: "#000000",
  };

  return colorShades[colorName] || colorName;
}

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
      backgroundColor: tourcolor ? tourcolor : "#F23636",
    },
    "&.MuiPickersDay-root.Mui-selected": {
      backgroundColor: tourcolor,
    },
  }),
  ...(!hasSchedule && {
    "&.MuiPickersDay-root": {
      opacity: "0.35",
    },
  }),
}));

const renderDay = (slotProps: any, tours) => {
  const { day } = slotProps;

  if (!Array.isArray(tours)) {
    return <CustomPickersDay {...slotProps} />;
  }

  const hasSchedule = tours.some((item: any) =>
    dayjs(item.date).isSame(day, "day")
  );

  const matchingSchedules = tours.filter((item: any) =>
    dayjs(item.date).isSame(day, "day")
  );

  const hasHolidayOrDayOff = matchingSchedules.some(
    (item: any) => item.status === "HOLIDAY" || item.status === "DAY_OFF"
  );

  let tourcolor = "";

  if (hasSchedule && !hasHolidayOrDayOff) {
    const workingTour = matchingSchedules.find(
      (tour: any) => tour.status === "WORKING"
    );
    if (workingTour) {
      tourcolor = mapColorToShade(workingTour.color);
    }
    return (
      <CustomPickersDay
        {...slotProps}
        hasSchedule={hasSchedule}
        tourcolor={tourcolor}
      />
    );
  } else if (hasHolidayOrDayOff) {
    return (
      <CustomPickersDay
        {...slotProps}
        hasSchedule={hasSchedule}
        schedule={matchingSchedules}
      />
    );
  } else {
    return <CustomPickersDay {...slotProps} />;
  }
};

export default renderDay;
