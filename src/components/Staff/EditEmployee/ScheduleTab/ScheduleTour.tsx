import { Button } from "@mui/material";
import React, { useState } from "react";
import { deleteSchedule } from "../../../../auth/api/requests";
import { settingsIcon } from "../../../../icons/icons";
import AddNewTour from "./AddNewTour";
import EditEmployeeTour from "./EditEmployeeTour";
import classes from "./ScheduleTour.module.css";
import { getUniqueColor } from "./uniqueColor";

type Props = {
  tours: any[];
  employee: any;
  workingDaysCount: number;
  restingDaysCount: number;
  setTours: (tours) => void;
  handleCreateSpace: () => void;
  addedTours: any[];
  setAddedTours: (tours) => void;
  tourNames: any[];
  setTourNames: (tourNames) => void;
  spaceNames: any[];
  setSpaceNames: (spaceNames) => void;
  startTimes: any[];
  setStartTimes: (startTimes) => void;
  endTimes: any[];
  setEndTimes: (endTimes) => void;
  setEdittedStartTime: (value) => void;
  setEdittedEndTime: (value) => void;
  setEdittedSpaceName: (value) => void;
  setEdittedName: (value) => void;
};
const ScheduleTour = ({
  tours,
  employee,
  workingDaysCount,
  restingDaysCount,
  setTours,
  handleCreateSpace,
  addedTours,
  setAddedTours,
  tourNames,
  setTourNames,
  spaceNames,
  setSpaceNames,
  startTimes,
  setStartTimes,
  endTimes,
  setEndTimes,
  setEdittedEndTime,
  setEdittedSpaceName,
  setEdittedName,
  setEdittedStartTime,
}: Props) => {
  const [isEditTourOpen, setIsEditTourOpen] = useState(false);

  const handleAddNewScheduleClick = () => {
    setIsEditTourOpen(true);
  };

  const handleEditStartTime = (selectedOption: any, title: string) => {
    const updatedTours = tours.map((tour) =>
      tour.title === title ? { ...tour, startTime: selectedOption.value } : tour
    );
    setTours(updatedTours);
    setEdittedStartTime(true);
  };

  const handleEditEndTime = (selectedOption: any, title: string) => {
    const updatedTours = tours.map((tour) =>
      tour.title === title ? { ...tour, endTime: selectedOption.value } : tour
    );
    setTours(updatedTours);
    setEdittedEndTime(true);
  };

  const handleEditSpaceName = (selectedOption: any, title: string) => {
    const updatedTours = tours.map((tour) =>
      tour.title === title ? { ...tour, floor: selectedOption.label } : tour
    );
    setTours(updatedTours);
    setEdittedSpaceName(true);
  };

  const handleEditTourName = (
    event: React.ChangeEvent<HTMLInputElement>,
    title: string
  ) => {
    const newTitle = event.target.value;

    const updatedTours = tours.map((tour) =>
      tour.title === title
        ? {
            ...tour,
            title: newTitle,
            originalTitle: tour.originalTitle || title,
          }
        : tour
    );

    setTours(updatedTours);
    setEdittedName(true);
  };

  const handleDeleteTour = async (userId: string, title: string) => {
    try {
      await deleteSchedule(userId, title);
    } catch (error) {
      console.error("Can't delete schedule:", error);
    }
  };

  const [startTime, setStartTime] = useState<any>(null);
  const [endTime, setEndTime] = useState<any>(null);

  const handleSpaceNameChange = (selectedOption: any, tourId: number) => {
    const updatedSpaceNames = [...spaceNames];
    updatedSpaceNames[tourId - 1] = selectedOption.label;
    setSpaceNames(updatedSpaceNames);
  };

  const handleStartTimeChange = (selectedOption: any, tourId: number) => {
    const updatedStartTimes = [...startTimes];
    updatedStartTimes[tourId - 1] = selectedOption.value;
    setStartTimes(updatedStartTimes);
    setStartTime(selectedOption.value);
  };
  const handleEndTimeChange = (selectedOption: any, tourId: number) => {
    const updatedEndTimes = [...endTimes];
    updatedEndTimes[tourId - 1] = selectedOption.value;
    setEndTimes(updatedEndTimes);
    setEndTime(selectedOption.value);
  };
  const handleAddTourName = (
    event: React.ChangeEvent<HTMLInputElement>,
    tourId: number
  ) => {
    const newTitle = event.target.value;
    const updatedTourNames = tourNames.map((name, index) =>
      index === tourId - 1 ? newTitle : name
    );
    setTourNames(updatedTourNames);
  };
  const handleDeleteAddedTour = (tourId: number) => {
    setAddedTours((prevTours) =>
      prevTours.filter((tour) => tour.id !== tourId)
    );
  };

  const [tourColors, setTourColors] = useState<Map<number, string | null>>(
    new Map()
  );

  const [isInvalidTime, setIsInvalidTime] = useState(false);

  const handleInvalidTimeChange = (invalidTime) => {
    setIsInvalidTime(invalidTime);
  };

  const [usedColors, setUsedColors] = useState([]);

  const handleAddNewTourClick = () => {
    const newColor = getUniqueColor(tours, usedColors, setUsedColors);
    const newTour = {
      id: addedTours.length + 1,
      isOpen: true,
      title: "",
      color: newColor,
    };
    setAddedTours([...addedTours, newTour]);
    setTourNames([...tourNames, ""]);
    setSpaceNames([...spaceNames, ""]);
    setStartTimes([...startTimes, ""]);
    setEndTimes([...endTimes, ""]);
    setTourColors((prevColors) =>
      new Map(prevColors).set(newTour.id, newColor)
    );
  };

  const uniqueTourTitles = new Set();
  tours.forEach((tour) => {
    uniqueTourTitles.add(tour.title);
  });
  const uniqueTourTitlesLength = uniqueTourTitles.size;

  return (
    <div className={classes.ScheduleTour}>
      <label className={classes.ScheduleTourLabel}>Working tours</label>
      <div className={classes.ScheduleTourTable}>
        {isEditTourOpen && tours.length > 0 && (
          <div className={classes.ToursInformation}>
            {tours
              .filter((tour, index, self) => {
                const currentDate = new Date();
                const tourDate = new Date(tour.date);

                const isTodayOrFutureOrPastTour =
                  tourDate >= new Date(currentDate.toDateString());

                const hasFutureDates = self.some(
                  (t) =>
                    t.title === tour.title &&
                    new Date(t.date) > new Date(currentDate.toDateString())
                );

                return (
                  index === self.findIndex((t) => t.title === tour.title) &&
                  (isTodayOrFutureOrPastTour || hasFutureDates)
                );
              })
              .map((tour) => (
                <React.Fragment key={tour.id}>
                  <EditEmployeeTour
                    key={tour.id}
                    employee={employee}
                    workingDaysCount={workingDaysCount}
                    restingDaysCount={restingDaysCount}
                    spaceName={tour.floor}
                    spaneNameChange={(selectedOption: any) =>
                      tour.title !== undefined
                        ? handleEditSpaceName(selectedOption, tour.title)
                        : null
                    }
                    startTime={tour.startTime}
                    startTimeChange={(selectedOption: any) =>
                      tour.title !== undefined
                        ? handleEditStartTime(selectedOption, tour.title)
                        : null
                    }
                    endTime={tour.endTime}
                    endTimeChange={(selectedOption: any) =>
                      tour.title !== undefined
                        ? handleEditEndTime(selectedOption, tour.title)
                        : null
                    }
                    tourName={tour.title}
                    tourNameChange={(event) =>
                      tour.title !== undefined
                        ? handleEditTourName(event, tour.title)
                        : null
                    }
                    onClose={() =>
                      tour.title !== undefined
                        ? handleDeleteTour(employee.id, tour.title)
                        : null
                    }
                    tours={tours}
                    tour={tour}
                    color={tour.color}
                    handleCreateSpace={handleCreateSpace}
                  />
                </React.Fragment>
              ))}
          </div>
        )}

        {isEditTourOpen ? (
          <>
            {addedTours.map((tour, index) =>
              tour.isOpen ? (
                <EditEmployeeTour
                  key={tour.id}
                  employee={employee}
                  workingDaysCount={workingDaysCount}
                  restingDaysCount={restingDaysCount}
                  spaceName={spaceNames[index]}
                  spaneNameChange={(selectedOption: any) =>
                    handleSpaceNameChange(selectedOption, tour.id)
                  }
                  startTime={startTimes[index]}
                  startTimeChange={(selectedOption: any) =>
                    handleStartTimeChange(selectedOption, tour.id)
                  }
                  endTime={endTimes[index]}
                  endTimeChange={(selectedOption: any) =>
                    handleEndTimeChange(selectedOption, tour.id)
                  }
                  tourName={tourNames[index]}
                  tourNameChange={(event) => handleAddTourName(event, tour.id)}
                  onClose={() => handleDeleteAddedTour(tour.id)}
                  tours={tours}
                  color={tourColors.get(tour.id)}
                  onInvalidTimeChange={handleInvalidTimeChange}
                  handleCreateSpace={handleCreateSpace}
                />
              ) : null
            )}
            <AddNewTour
              onButtonClick={handleAddNewTourClick}
              addedLenght={addedTours.length}
              existingLenght={uniqueTourTitlesLength}
              workingDaysCount={workingDaysCount}
            />
          </>
        ) : (
          <Button
            className={classes.ScheduleTourButton}
            startIcon={settingsIcon}
            sx={{ color: "orange" }}
            disableRipple
            onClick={handleAddNewScheduleClick}
          >
            <span className={classes.ScheduleTourButtonText}>
              Setup working tours
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};
export default ScheduleTour;
