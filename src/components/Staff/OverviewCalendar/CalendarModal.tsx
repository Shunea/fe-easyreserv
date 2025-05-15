import dayjs from "dayjs";
import moment from "moment";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  closeIcon,
  dotIcon,
  FloorIcon,
  spreadIcon,
  sunIconUri,
  healthIconUri,
  restIconUri,
  VacationCalendarIcon,
  arrowRightIcon,
} from "../../../icons/icons";
import OutsideClickHandler from "../components/OutsideClickHandler";
import CalendarEmployeeDetails from "./CalendarEmployeeDetails";
import classes from "./CalendarModal.module.css";
import TimeTable from "./TimeTable";

type Props = {
  onClose: () => void;
  clickedDay: Date;
  dayType: string;
  employeesWithVacations: any[];
  employeesWithSchedules: any[];
};
const CalendarModal = (props: Props) => {
  const employeeBoxRef = useRef<HTMLDivElement | null>(null);
  const buttonModalRef = useRef<HTMLDivElement | null>(null);
  const DEFAULT_IMAGE = "/staffImages/barmen.png";

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const handleToggleSpreadButton = (
    employee: any,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation(); // Prevent the event from propagating to the outer container

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const modalWidth = 80;

    setModalPosition({
      top: buttonRect.top + buttonRect.height + 10, // 10px below the button's center
      left: buttonRect.right - modalWidth, // Right upper corner of the button
    });

    setSelectedEmployee((prevState) =>
      prevState === employee ? null : employee
    );
  };

  const [activeTab, setActiveTab] = useState("");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const clickedDay = props.clickedDay;

  const findFloorForDay = (employee) => {
    const clickedDay = new Date(props.clickedDay);
    clickedDay.setHours(0, 0, 0, 0);

    const scheduleForDay = employee.staffSchedules.find((schedule) => {
      const checkinTime = new Date(schedule.checkinTime || schedule.date);
      const localCheckinDate = new Date(checkinTime.toLocaleString());
      localCheckinDate.setHours(0, 0, 0, 0);
      return localCheckinDate.getDate() === clickedDay.getDate();
    });

    return scheduleForDay?.floor || null;
  };

  const findCheckInTime = (employee) => {
    const clickedDay = new Date(props.clickedDay);
    clickedDay.setHours(0, 0, 0, 0);

    const scheduleForDay = employee.staffSchedules?.find(schedule => {
      if (!schedule.checkinTime) return false;
      
      const checkinTime = new Date(schedule.checkinTime);
      const scheduleDay = checkinTime.getUTCDate();
      const selectedDay = clickedDay.getDate();
      
      return scheduleDay === selectedDay;
    });

    if (scheduleForDay?.checkinTime) {
      const date = new Date(scheduleForDay.checkinTime);
      return date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC'
      });
    }
    return null;
  };

  const findCheckOutTime = (employee) => {
    const clickedDay = new Date(props.clickedDay);
    clickedDay.setHours(0, 0, 0, 0);

    const scheduleForDay = employee.staffSchedules?.find(schedule => {
      if (!schedule.checkoutTime) return false;
      
      const checkoutTime = new Date(schedule.checkoutTime);
      const scheduleDay = checkoutTime.getUTCDate();
      const selectedDay = clickedDay.getDate();
      
      return scheduleDay === selectedDay;
    });

    if (scheduleForDay?.checkoutTime) {
      const date = new Date(scheduleForDay.checkoutTime);
      return date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC'
      });
    }
    return null;
  };

  // Add this function to count checked-in employees
  const getTotalCheckedInUsers = () => {
    return props.employeesWithSchedules.length;
  };

  // Add this handler
  const handleClickOutside = (e: MouseEvent) => {
    if (
      buttonModalRef.current && 
      !buttonModalRef.current.contains(e.target as Node) &&
      e.target && !(e.target as HTMLElement).closest(`.${classes.EmployeeActionButton}`)
    ) {
      setSelectedEmployee(null);
    }
  };

  // Add useEffect for click listener
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={classes.EditEmployeeModal}>
      {activeTab === "details" ? (
        <CalendarEmployeeDetails
          employee={selectedEmployee}
          onBack={handleTabClick}
          onClose={props.onClose}
        />
      ) : activeTab === "time" ? (
        <TimeTable
          employee={selectedEmployee}
          onBack={handleTabClick}
          onClose={props.onClose}
        />
      ) : (
        <div ref={employeeBoxRef} className={classes.EditEmployeeBox}>
          <OutsideClickHandler
            innerRef={employeeBoxRef}
            onClose={props.onClose}
          />
          <div className={classes.BoxHead}>
            <div className={classes.BoxHeadInfo}>
              <p className={classes.BoxHeadTitle}>
                {props.dayType === "WORK" ? "Staff on " : "Vacations on "}
                <span className={classes.BoxHeadDate}>
                  {dayjs(props.clickedDay).format("D MMMM, YYYY")}
                </span>
                {props.dayType === "WORK" && (
                  <span className={classes.TotalUsers}>
                    • Total users: {getTotalCheckedInUsers()}
                  </span>
                )}
              </p>
            </div>
            <div className={classes.BoxHeadButtonContainer}>
              <button className={classes.BoxHeadButton} onClick={props.onClose}>
                {closeIcon}
              </button>
            </div>
          </div>
          <div className={classes.BoxBody}>
            <div className={classes.BoxList}>
              {props.dayType === "WORK"
                ? props.employeesWithSchedules.map((employee) => (
                    <div key={employee.id} className={classes.EmployeeRow}>
                      <div className={classes.EmployeeNameContainer}>
                        <div
                          className={classes.EmployeeAvatarContainer}
                          style={{
                            background: employee.avatar
                              ? `url(${employee.avatarUrl}), lightgray 50% / cover no-repeat`
                              : `url(${DEFAULT_IMAGE})`,
                            backgroundSize: "56px 56px",
                          }}
                        >
                          <span className={classes.WorkDot}>{dotIcon}</span>
                        </div>
                        <div className={classes.EmployeeTitleContainer}>
                          <div className={classes.EmployeeNameRow}>
                            <p className={classes.EmployeeName}>
                              {employee.username}
                            </p>
                            {findCheckInTime(employee) && (
                              <span className={classes.CheckInTime}>
                                • Check In ({findCheckInTime(employee)})
                                {findCheckOutTime(employee) && ` • Check Out (${findCheckOutTime(employee)})`}
                              </span>
                            )}
                          </div>
                          <div className={classes.EmployeeRole}>
                            Role: {employee.role === "GENERAL" ? employee.roleName : employee.role || 'N/A'}
                          </div>
                          <div className={classes.EmployeeSpace}>
                            <span className={classes.EmployeeSpaceIcon}>
                              {FloorIcon}
                            </span>
                            <span className={classes.EmployeeSpaceName}>
                              {findFloorForDay(employee)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={classes.EmployeeActionsContainer}>
                        <button
                          className={classes.EmployeeActionButton}
                          onClick={(e) => handleToggleSpreadButton(employee, e)}
                        >
                          <span className={classes.EmployeeActionIcon}>
                            {spreadIcon}
                          </span>
                        </button>
                        {selectedEmployee === employee && (
                          <div
                            ref={buttonModalRef}
                            className={classes.ButtonModal}
                            style={{
                              position: "fixed",
                              top: modalPosition.top + "px",
                              left: modalPosition.left + "px",
                              zIndex: 999,
                            }}
                          >
                            <button
                              className={classes.ModalButton}
                              onClick={() => handleTabClick("details")}
                            >
                              Details
                            </button>
                            <button
                              className={classes.ModalButton}
                              onClick={() => handleTabClick("time")}
                            >
                              TimeTable
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                : props.employeesWithVacations.map((employee) => (
                    <div key={employee.id} className={classes.EmployeeRow}>
                      <div className={classes.EmployeeNameContainer}>
                        <div
                          className={classes.EmployeeAvatarContainer}
                          style={{
                            background: employee.avatar
                              ? `url(${employee.avatarUrl}), lightgray 50% / cover no-repeat`
                              : `url(${DEFAULT_IMAGE})`,
                            backgroundSize: "56px 56px",
                          }}
                        ></div>
                        <div className={classes.EmployeeTitleContainer}>
                          <div className={classes.EmployeeNameRow}>
                            <p className={classes.EmployeeName}>
                              {employee.username}
                            </p>
                            {findCheckInTime(employee) && (
                              <span className={classes.CheckInTime}>
                                • Check In ({findCheckInTime(employee)})
                                {findCheckOutTime(employee) && ` • Check Out (${findCheckOutTime(employee)})`}
                              </span>
                            )}
                          </div>
                          <div className={classes.EmployeeRole}>
                            Role: {employee.role === "GENERAL" ? employee.roleName : employee.role || 'N/A'}
                          </div>
                          <div className={classes.EmployeeSpace}>
                            <span className={classes.EmployeeSpaceIcon}>
                              {FloorIcon}
                            </span>
                            <span className={classes.EmployeeSpaceName}>
                              {findFloorForDay(employee)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={classes.EmployeeActionsContainer}>
                        <button className={classes.EmployeeActionButton}>
                          <span className={classes.EmployeeActionIcon}>
                            {spreadIcon}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <div className={classes.BoxAction}>
            <Link to="/staff" style={{ textDecoration: "none", width: "100%" }}>
              <button className={classes.BoxActionButton}>
                <span className={classes.BoxActionText}>
                  View staff members
                </span>
                <span className={classes.BoxActionIcon}>{arrowRightIcon}</span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
export default CalendarModal;
