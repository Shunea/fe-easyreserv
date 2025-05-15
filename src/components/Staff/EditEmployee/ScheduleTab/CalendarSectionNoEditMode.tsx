import dayjs from "dayjs";
import React from "react";
import { updatePurpose } from "../../../../auth/api/requests";
import {
  acceptIcon,
  CalendarDotIcon,
  closeIcon,
  FloorIcon,
} from "../../../../icons/icons";
import classes from "./CalendarSectionNoEditMode.module.css";
import EditScheduleButton from "./EditScheduleButton";

type Props = {
  schedules: any[];
  tours: any[];
  value: any;
  setIsEditMode: (value) => void;
};
const CalendarSectionEditMode = ({
  schedules,
  tours,
  value,
  setIsEditMode,
}: Props) => {
  const handleUpdatePurpose = async (scheduleId, purposeId, newStatus) => {
    try {
      await updatePurpose(purposeId, scheduleId, newStatus);
    } catch (error) {
      console.error("Can't update purpose:", error);
    }
  };

  const handleEditSchedule = () => {
    setIsEditMode(true);
  };

  return (
    <>
      {schedules.map((item: any, index) => {
        if (item.status === "WORKING") {
          const matchingTour = tours.find((tour) =>
            dayjs(item.date).isSame(dayjs(tour.date), "day")
          );
          if (matchingTour) {
            return (
              <React.Fragment key={index}>
                <div className={classes.WorkingContent}>
                  <div className={classes.WorkingTitle}>
                    <span
                      className={`${classes.TurColor} ${
                        classes[matchingTour.color]
                      }`}
                    ></span>
                    <span className={classes.TurTitle}>
                      {matchingTour.title}
                    </span>
                  </div>
                  <div className={classes.WorkingCaption}>
                    <span className={classes.TurTime}>
                      {dayjs(matchingTour.startTime, "HH:mm").format("HH:mm")} —{" "}
                      {dayjs(matchingTour.endTime, "HH:mm").format("HH:mm")}
                    </span>
                    <span style={{ opacity: 0.2, display: "flex" }}>
                      {CalendarDotIcon}
                    </span>
                    <div className={classes.TurSpace}>
                      <span
                        style={{
                          display: "flex",
                          width: "12px",
                          height: "12px",
                          opacity: "0.35",
                        }}
                      >
                        {FloorIcon}
                      </span>
                      <span className={classes.TurSpaceName}>
                        {matchingTour.floor}
                      </span>
                    </div>
                  </div>
                  {schedules.length > 0 && (
                    <>
                      {schedules
                        .filter((schedule) =>
                          dayjs(schedule.date).isSame(dayjs(value), "day")
                        )
                        .filter(
                          (schedule) => schedule?.purpose?.status === "WAITING"
                        )
                        .map((schedule) => (
                          <div key={index} className={classes.ProposedTour}>
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

                <EditScheduleButton onClick={handleEditSchedule} />
              </React.Fragment>
            );
          }
        }
        return null;
      })}
    </>
  );
};
export default CalendarSectionEditMode;
