import dayjs from "dayjs";
import CustomSelect from "../components/CustomSelect";
import classes from "./CalendarSectionEditMode.module.css";
import CustomSelectStyles from "../components/CustomSelectStyles";
import {
  deleteScheduleByDay,
  getRestaurantById,
  updatePurpose,
} from "../../../../auth/api/requests";
import {
  acceptIcon,
  closeIcon,
  deleteIcon,
  lineIcon,
} from "../../../../icons/icons";
import { useEffect, useState } from "react";
import { TourType } from "../../StaffTypes";
import getTimeOptions from "./TimeOptions";

type Props = {
  tours: any[];
  value: any;
  tourName: string;
  setTourName: (name) => void;
  employee: any;
  startTime: any;
  handleStartTimeChange: (selectedOption, tourId) => void;
  setStartTime: (value) => void;
  setEndTime: (value) => void;
  endTime: any;
  HandleEndTimeChange: (selectedOption, tourId) => void;
  tourNames: any[];
  setTourNames: (updatedTourNames: Array<any>) => void;
  schedules: any[];
  setIsEditMode: (value) => void;
  setSelectedTour: (tour) => void;
  setChangingTour: (tour) => void;
};
const CalendarSectionEditMode = ({
  tours,
  value,
  tourName,
  employee,
  startTime,
  endTime,
  handleStartTimeChange,
  HandleEndTimeChange,
  tourNames,
  setTourNames,
  setTourName,
  setStartTime,
  setEndTime,
  schedules,
  setIsEditMode,
  setSelectedTour,
  setChangingTour,
}: Props) => {
  const matchingTour = tours.find((tour) =>
    dayjs(value).isSame(dayjs(tour.date), "day")
  );

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

  const sortedTourTitles = getUniqueTourTitles(tours).sort();

  const editEmployeeCardStyles = {
    ...CustomSelectStyles,
    control: (provided: any) => ({
      ...provided,
      height: "auto",
      width: "auto",
      border: "0",
      outline: "0",
      boxShadow: "none",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    }),
    dropdownIndicator: () => ({
      width: "20px",
      height: "20px",
      alignItems: "center",
      display: "flex",
    }),
  };

  const handleDeleteScheduleByDay = async (
    userId: string,
    scheudleId: string
  ) => {
    try {
      await deleteScheduleByDay(userId, scheudleId);
    } catch (error) {
      console.error("Can't delete scheudle on this day:", error);
    }
  };

  const handleTourNameChange = (selectedOption: any, tourId: number) => {
    const updatedTourNames = [...tourNames];
    updatedTourNames[tourId - 1] = selectedOption.value;
    setTourNames(updatedTourNames);

    const selectedTour = tours.find(
      (tour) => tour.title === selectedOption.value
    );

    const changingTour = tours.find(
      (tour) =>
        dayjs(tour.date).format("YYYY-MM-DD") ===
        dayjs(value).format("YYYY-MM-DD")
    );

    if (changingTour) {
      setTourName(selectedOption.value);
      setStartTime(selectedTour?.startTime);
      setEndTime(selectedTour?.endTime);
      setSelectedTour(selectedTour || null);
      setChangingTour(changingTour);
    } else {
      setStartTime(null);
      setEndTime(null);
    }
  };

  interface Restaurant {
    workSchedule: {
      [day: string]: {
        isOpen: boolean;
        closingTime: string;
        openingTime: string;
        nextDayOpeningTime: string;
      };
    };
    // ... other properties
  }

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const storedRestaurant = JSON.parse(
    localStorage.getItem("selectedRestaurant") ?? "null"
  );

  const [initial, setInitial] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        if (storedRestaurant && initial === false) {
          const RestaurantResponse = await getRestaurantById(
            storedRestaurant.id
          );
          setRestaurant(RestaurantResponse);
          setInitial(true);
        }
      } catch (error) {
        console.error("Can't getRestautant");
      }
    };
    fetchRestaurant();
  }, [storedRestaurant]);

  const timeOptions = getTimeOptions(restaurant);

  const editEmployeeTimeStyles = {
    ...CustomSelectStyles,
    control: (provided: any) => ({
      ...provided,
      height: "auto",
      width: "auto",
      outline: "0",
      display: "flex",
      alignItems: "center",
      padding: "8px 8px 8px 12px",
      justifyContent: "center",
      gap: "8px",
      borderRadius: "8px",
      border: "1px solid #EEE",
      background: "var(--brand-snow, #FFF)",
      boxShadow:
        "0px 0px 0px 0px rgba(0, 0, 0, 0.02), 0px 1px 1px 0px rgba(0, 0, 0, 0.02), 0px 2px 2px 0px rgba(0, 0, 0, 0.02), 0px 5px 3px 0px rgba(0, 0, 0, 0.01), 0px 9px 4px 0px rgba(0, 0, 0, 0.00), 0px 15px 4px 0px rgba(0, 0, 0, 0.00)",
    }),
    dropdownIndicator: () => ({
      width: "20px",
      height: "20px",
      alignItems: "center",
      display: "flex",
    }),
  };
  const handleUpdatePurpose = async (scheduleId, purposeId, newStatus) => {
    try {
      await updatePurpose(purposeId, scheduleId, newStatus);
    } catch (error) {
      console.error("Can't update purpose:", error);
    }
  };

  return (
    <>
      <div className={classes.EditScheduleCard}>
        <div className={classes.CardHead}>
          <div className={classes.HeadTitle}>
            <span
              className={`${classes.TurColor} ${classes[matchingTour.color]}`}
            ></span>
            <CustomSelect
              value={tourName}
              onChange={(selectedOption) =>
                handleTourNameChange(selectedOption, 0)
              }
              options={sortedTourTitles.map((title) => ({
                value: title,
                label: title,
              }))}
              placeholder="Select space"
              styles={editEmployeeCardStyles}
            />
          </div>
          <div className={classes.HeadActions}>
            <button
              className={classes.DiscardEdit}
              onClick={() =>
                handleDeleteScheduleByDay(employee.id, matchingTour.id)
              }
            >
              {deleteIcon}
            </button>
          </div>
        </div>
        <div className={classes.CardContent}>
          <CustomSelect
            value={dayjs(startTime, "HH:mm").format("HH:mm")}
            onChange={(selectedOption) =>
              handleStartTimeChange(selectedOption, 0)
            }
            options={timeOptions}
            placeholder="From"
            styles={editEmployeeTimeStyles}
          />
          <span className={classes.lineIcon}>{lineIcon}</span>
          <CustomSelect
            value={dayjs(endTime, "HH:mm").format("HH:mm")}
            onChange={(selectedOption) =>
              HandleEndTimeChange(selectedOption, 0)
            }
            options={timeOptions}
            placeholder="Until"
            styles={editEmployeeTimeStyles}
          />
        </div>
        {schedules && (
          <>
            {schedules
              .filter((schedule) =>
                dayjs(schedule.date).isSame(dayjs(value), "day")
              )
              .filter((schedule) => schedule?.purpose?.status === "WAITING")
              .map((schedule) => (
                <div className={classes.ProposedTourEditMode}>
                  <div className={classes.ProposedTourContent}>
                    <span className={classes.ProposedText}>
                      Employee proposed
                    </span>
                    <span className={classes.ProposedTime}>
                      {schedule?.purpose?.startTime} —{" "}
                      {schedule?.purpose?.endTime}
                    </span>
                  </div>
                  <div className={classes.ProposedTourActions}>
                    <button
                      className={classes.DeclinePropose}
                      onClick={() =>
                        handleUpdatePurpose(
                          schedule?.purpose?.scheduleId,
                          schedule?.purpose?.id,
                          "DECLINED"
                        )
                      }
                    >
                      {closeIcon}
                    </button>
                    <button
                      className={classes.AcceptPropose}
                      onClick={() =>
                        handleUpdatePurpose(
                          schedule?.purpose?.scheduleId,
                          schedule?.purpose?.id,
                          "APPROVED"
                        )
                      }
                    >
                      {acceptIcon}
                    </button>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>

      <button
        className={classes.CancelEdit}
        onClick={() => setIsEditMode(false)}
      >
        <span className={classes.CancelEditText}>Cancel</span>
      </button>
    </>
  );
};
export default CalendarSectionEditMode;
