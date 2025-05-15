import React, { useState, useEffect } from "react";
import classes from "./EditEmployeeSchedule.module.css";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import {
  addSchedule1,
  editSchedule,
  getScheduleByMonth,
} from "src/auth/api/requests";
import CalendarSection from "./CalendarSection";
import { TourType } from "../../StaffTypes";
import Spinner from "../../../Spinner";
import HalfPageForm from "../../../../UI/HalfPageForm";
import NewSpaceForm from "../../../Restaurant/Spaces/NewSpaceForm";
import TourFirstInfo from "./TourFirstInfo";
import ScheduleTour from "./ScheduleTour";

type EditEmployeeScheduleProps = {
  employee: any;
};

const EditEmployeeSchedule: React.FC<EditEmployeeScheduleProps> = ({
  employee,
}) => {
  const [tours, setTours] = useState<TourType[]>([]);
  const [previousDays, setPreviousDays] = useState(6);
  const [upcomingDays, setUpcomingDays] = useState(6);
  const [yearAndMonth, setYearAndMonth] = useState(dayjs().format("YYYY-MM"));
  const [loading, setLoading] = useState(true);
  const [isInitialSortComplete, setIsInitialSortComplete] = useState(false);
  const [date, setDate] = useState();
  const [endDate, setEndDate] = useState();
  const [workingDaysCount, setWorkingDaysCount] = useState(1);
  const [restingDaysCount, setRestingDaysCount] = useState(1);
  const handleSetData = (date, endDate, workDays, restDays) => {
    setDate(date);
    setEndDate(endDate);
    setWorkingDaysCount(workDays);
    setRestingDaysCount(restDays);
  };

  const [tourNames, setTourNames] = useState<string[]>([]);

  useEffect(() => {
    if (yearAndMonth !== "" && previousDays !== 0 && upcomingDays !== 0) {
      const fetchTours = async () => {
        try {
          const response = await getScheduleByMonth(
            employee.id,
            yearAndMonth,
            previousDays,
            upcomingDays
          );

          const userResponse = response.data;

          if (Array.isArray(userResponse)) {
            const userTours = userResponse;

            if (!isInitialSortComplete) {
              const sortedUserTours = userTours
                .slice()
                .sort((a, b) =>
                  a.title && b.title ? a.title.localeCompare(b.title) : 0
                );

              setTours(sortedUserTours);
              setIsInitialSortComplete(false);
            } else {
              setTours(userTours);
            }
          } else {
            console.error("Invalid API response:", userResponse);
          }
          setTimeout(setLoading.bind(null, false), 500);
        } catch (error) {
          console.error("Error getting tours:", error);
        }
      };

      fetchTours();
    }
  }, [
    employee.id,
    isInitialSortComplete,
    setIsInitialSortComplete,

    previousDays,
    upcomingDays,
    yearAndMonth,
  ]);

  const [selectedTour, setSelectedTour] = useState<TourType | null>(null);
  const [changingTour, setChangingTour] = useState<TourType | null>(null);

  const [addedTours, setAddedTours] = useState<any[]>([]);
  const [startTimes, setStartTimes] = useState<string[]>(
    new Array(addedTours.length).fill("")
  );
  const [endTimes, setEndTimes] = useState<string[]>(
    new Array(addedTours.length).fill("")
  );
  const [spaceNames, setSpaceNames] = useState<string[]>(
    new Array(addedTours.length).fill("")
  );

  const CalendarSectionValidation =
    (selectedTour && changingTour !== null) ||
    selectedTour?.title !== changingTour?.title ||
    selectedTour?.startTime !== changingTour?.startTime ||
    selectedTour?.endTime !== changingTour?.endTime;

  const addedToursValidation =
    addedTours.length === 0
      ? false
      : addedTours.length > 0 &&
        date !== null &&
        !(
          addedTours.length !== workingDaysCount ||
          tourNames.every((name) => name === "") ||
          startTimes.every((name) => name === "") ||
          endTimes.every((name) => name === "") ||
          spaceNames.every((name) => name === "")
        );

  const [edittedSpaceName, setEdittedSpaceName] = useState(false);
  const [edittedStartTime, setEdittedStartTime] = useState(false);
  const [edittedEndTime, setEdittedEndTime] = useState(false);
  const [edittedName, setEdittedName] = useState(false);

  const edittedTourValidation =
    (edittedName === true && tours.some((tour) => tour.title !== "")) ||
    (edittedStartTime === true &&
      tours.some((tour) => tour.startTime !== null)) ||
    (edittedEndTime === true && tours.some((tour) => tour.endTime !== null)) ||
    (edittedSpaceName === true && tours.some((tour) => tour.floor !== ""));

  const GeneralValidationIsTrue =
    CalendarSectionValidation || addedToursValidation || edittedTourValidation;
  const handleCombinedSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      const updatedSchedules = await Promise.all(
        tours.map(async (tour) => {
          let originalTitle = tour.originalTitle || tour.title;

          const tourData = {
            title: tour.title,
            startTime: tour.startTime,
            endTime: tour.endTime,
            floor: tour.floor,
          };

          await editSchedule(employee.id, originalTitle, tourData);
          return tourData;
        })
      );

      setTours(updatedSchedules);

      if (selectedTour) {
        const tourData = {
          title: selectedTour.title,
          startTime: selectedTour.startTime,
          endTime: selectedTour.endTime,
          floor: selectedTour.floor,
          color: selectedTour.color,
        };
        const updatedSchedule = await editSchedule(
          employee.id,
          changingTour?.title || changingTour?.originalTitle,
          tourData
        );
        setSelectedTour(updatedSchedule);
        return tourData;
      }

      const startDay = dayjs(date).startOf("day");
      const endDay = dayjs(endDate).startOf("day");
      const schedules: TourType[] = [];
      let currentDay = startDay;
      let dayCount = 0;
      let remainingWorkingDays = workingDaysCount;
      let remainingRestingDays = restingDaysCount;
      const addedTourData = addedTours.map((tour, index) => ({
        title: tourNames[index],
        startTime: startTimes[index],
        endTime: endTimes[index],
        floor: spaceNames[index],
        color: tour.color,
      }));

      for (let i = 0; i <= endDay.diff(startDay, "day"); i++) {
        const isWorkingDay =
          remainingWorkingDays > 0 &&
          (remainingWorkingDays > 0 || remainingRestingDays === 0);
        const status = isWorkingDay ? "WORKING" : "HOLIDAY";

        const tourIndex = i % addedTourData.length;
        const tour = addedTourData[tourIndex];

        const startTime = tour.startTime === null ? undefined : tour.startTime;
        let endTime = tour.endTime === null ? undefined : tour.endTime;

        // If endTime is after midnight, use the next day
        // if (endTime !== undefined && endTime.isBefore(startTime)) {
        //   endTime = endTime.add(1, "day");
        // }

        const scheduleItem = {
          title: tour.title,
          date: currentDay.startOf("day").format("YYYY-MM-DD HH:mm:ss"), // Set the time to 00:00:00
          startTime: startTime ? startTime : undefined,
          endTime: endTime ? endTime : undefined,
          floor: tour.floor ?? "",
          status: status,
          color: tour.color,
        };

        if (isWorkingDay) {
          remainingWorkingDays--;
        } else {
          remainingRestingDays--;
        }

        schedules.push(scheduleItem);

        currentDay = currentDay.add(1, "day");

        dayCount++;

        if (dayCount % (workingDaysCount + restingDaysCount) === 0) {
          remainingWorkingDays = workingDaysCount;
          remainingRestingDays = restingDaysCount;
        }
      }

      const requestData: TourType[] = schedules.map((item) => ({
        ...item,
        status: item.status === "WORKING" ? "WORKING" : "HOLIDAY",
      }));

      if (addedTourData.length > 0) {
        const scheduleData = await addSchedule1(employee.id, requestData);
      }
    } catch (error) {
      console.error("Error updating or submitting schedule:", error);
    }
  };

  // const edittedTourValidation =
  //   (edittedName === true && tours.some((tour) => tour.title !== "")) ||
  //   (edittedStartTime === true &&
  //     tours.some((tour) => tour.startTime !== null)) ||
  //   (edittedEndTime === true && tours.some((tour) => tour.endTime !== null)) ||
  //   (edittedSpaceName === true && tours.some((tour) => tour.floor !== ""));

  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const handleCreateSpace = () => {
    setIsCreateSpaceOpen((prevState) => !prevState);
  };

  return (
    <>
      {!loading && !isCreateSpaceOpen ? (
        <form className={classes.BoxForm} onSubmit={handleCombinedSubmit}>
          <TourFirstInfo
            addedTours={addedTours}
            handleSetData={handleSetData}
          />

          <ScheduleTour
            tours={tours}
            employee={employee}
            setTours={setTours}
            workingDaysCount={workingDaysCount}
            restingDaysCount={restingDaysCount}
            handleCreateSpace={handleCreateSpace}
            addedTours={addedTours}
            setAddedTours={setAddedTours}
            tourNames={tourNames}
            setTourNames={setTourNames}
            spaceNames={spaceNames}
            setSpaceNames={setSpaceNames}
            startTimes={startTimes}
            setStartTimes={setStartTimes}
            endTimes={endTimes}
            setEndTimes={setEndTimes}
            setEdittedEndTime={setEdittedEndTime}
            setEdittedStartTime={setEdittedStartTime}
            setEdittedName={setEdittedName}
            setEdittedSpaceName={setEdittedSpaceName}
          />

          <CalendarSection
            employee={employee}
            tours={tours}
            tourNames={tourNames}
            setTourNames={setTourNames}
            startTimes={startTimes}
            setStartTimes={setStartTimes}
            endTimes={endTimes}
            setEndTimes={setEndTimes}
            setSelectedTour={setSelectedTour}
            setChangingTour={setChangingTour}
          />
          <Button
            type="submit"
            className={classes.Save}
            disabled={!GeneralValidationIsTrue}
          >
            <span className={classes.SaveText}>Save changes</span>
          </Button>
        </form>
      ) : isCreateSpaceOpen ? (
        <HalfPageForm title="Create space" onClose={handleCreateSpace}>
          <NewSpaceForm />
        </HalfPageForm>
      ) : null}
      <Spinner loading={loading} type="bounce" />
    </>
  );
};

export default EditEmployeeSchedule;
