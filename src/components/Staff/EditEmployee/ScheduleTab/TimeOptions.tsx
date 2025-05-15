import dayjs from "dayjs";

type Props = {
  restaurant: any;
};

const getTimeOptions = (
  restaurant: any
): { value: string; label: string }[] => {
  const workSchedule = restaurant !== null ? restaurant.workSchedule : null;
  const timeOptions: { value: string; label: string }[] = [];

  if (workSchedule !== null) {
    const scheduleEntries: [
      string,
      { isOpen: boolean; closingTime: string; openingTime: string }
    ][] = Object.entries(workSchedule);
    const filteredEntries = scheduleEntries.filter(([, day]) => day.isOpen);

    let minOpeningTime = Infinity;
    let maxClosingTime = 0;

    filteredEntries.forEach(([, day]) => {
      const openingTime = dayjs(day.openingTime, "HH:mm").valueOf();
      const closingTime =
        day.closingTime === "00:00" ? "24:00" : day.closingTime;
      const closingTimeValue = dayjs(closingTime, "HH:mm").valueOf();

      if (openingTime < minOpeningTime) {
        minOpeningTime = openingTime;
      }

      if (closingTimeValue > maxClosingTime) {
        maxClosingTime = closingTimeValue;
      }

      if (closingTimeValue < openingTime) {
        const closingTimeAfterMidnight = dayjs(closingTime, "HH:mm")
          .add(1, "day")
          .valueOf();
        if (closingTimeAfterMidnight > maxClosingTime) {
          maxClosingTime = closingTimeAfterMidnight;
        }
      }
    });

    if (minOpeningTime !== Infinity && maxClosingTime !== 0) {
      let currentTime = dayjs(minOpeningTime);

      while (
        currentTime.isBefore(dayjs(maxClosingTime)) ||
        (dayjs(maxClosingTime).format("HH:mm") === "00:00" &&
          currentTime.format("HH:mm") !== "00:00")
      ) {
        timeOptions.push({
          value: currentTime.format("HH:mm"),
          label: currentTime.format("HH:mm"),
        });

        currentTime = currentTime.add(30, "minutes");
      }

      timeOptions.push({
        value: dayjs(maxClosingTime).format("HH:mm"),
        label: dayjs(maxClosingTime).format("HH:mm"),
      });
    }
  }

  return timeOptions;
};

export default getTimeOptions;
