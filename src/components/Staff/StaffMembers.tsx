import React from "react";
import classes from "./StaffMembers.module.css";
import Title from "../Title";
import AddEmployeeButton from "./AddEmployee/AddEmployeeButton";
import { calendarIcon, deleteIcon, EditWorkerIcon, ListViewIcon } from "../../icons/icons";
import { Button, useMediaQuery } from "@mui/material";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Employee } from "./StaffTypes";
import { deleteUser } from "../../auth/api/requests";
import { toast } from "react-toastify";

type ScheduleIcon = {
  scheduleIcon: string | null;
  tagIcon: string | null;
};

type ScheduleIcons = {
  [key: string]: ScheduleIcon;
};

type StaffMembersProps = {
  employees: Employee[];
  handleEmployeeClick: (id: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (value) => void;
  setNewFetch: (value) => void;
};

const StaffMembers: React.FC<StaffMembersProps> = (props) => {
  const DEFAULT_IMAGE = "/staffImages/DefaultImage.svg";
  const calendarColor = "black";
  // console.log("🚀 ~ employees:", props.employees)

  const scheduleIcons: ScheduleIcons = {
    HOLIDAY: {
      scheduleIcon: "/scheduleIcons/holiday.svg",
      tagIcon: null,
    },
    DAY_OFF: {
      scheduleIcon: "/scheduleIcons/dayOff.svg",
      tagIcon: null,
    },
    WORKING: {
      scheduleIcon: "/scheduleIcons/working.svg",
      tagIcon: "/scheduleIcons/floorIcon.svg",
    },
    "Waiting Invite": {
      scheduleIcon: "/scheduleIcons/waitingInvite.svg",
      tagIcon: null,
    },
    NoSchedules: {
      scheduleIcon: "/scheduleIcons/noSchedules.svg",
      tagIcon: null,
    },
  };
  const GenerateEmployeeRows = () => {
    const isSmallScreen = useMediaQuery("(min-width: 768px)");
    const isMediumScreen = useMediaQuery("(min-width: 1024px)");
    const isLargeScreen = useMediaQuery("(min-width: 1440px)");

    // Сортируем сотрудников
    const sortedEmployees = [...props.employees].sort((a, b) => {
      const aActive = a.staffSchedules?.some(schedule => schedule.checkStatus === 1) ?? false;
      const bActive = b.staffSchedules?.some(schedule => schedule.checkStatus === 1) ?? false;
      
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      return 0;
    });

    // Calculate the number of employees per row based on the screen size
    const employeesPerRow = isLargeScreen
      ? 6
      : isMediumScreen
      ? 4
      : isSmallScreen
      ? 3
      : 1;

    const rows: JSX.Element[] = [];
    let currentRow: Employee[] = [];

    sortedEmployees.forEach((employee) => {
      if (currentRow.length < employeesPerRow) {
        currentRow.push(employee);
      } else {
        rows.push(renderRow(currentRow));
        currentRow = [employee];
      }
    });

    if (currentRow.length > 0) {
      rows.push(renderRow(currentRow));
    }

    return rows;
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC'
    });
  };

  const renderRow = (rowEmployees: Employee[]) => {
    return (
      <div className={classes.EmployeeRow} key={rowEmployees[0].id}>
        {rowEmployees.map((employee) => {
          // Находим последний активный чекин
          const activeSchedule = employee.staffSchedules
            ?.sort((a, b) => {
              const dateA = new Date(a.checkinTime || 0);
              const dateB = new Date(b.checkinTime || 0);
              return dateB.getTime() - dateA.getTime(); // Сортируем по убыванию (самый последний первый)
            })
            .find(schedule => schedule.checkStatus === 1);

          // Определяем статус на основе наличия активного чекина
          const scheduleStatus = activeSchedule
            ? {
                status: "WORKING",
                isLoggedIn: true,
                floor: activeSchedule.floor || "Working"
              }
            : {
                status: "NoSchedules",
                isLoggedIn: false,
                floor: "No schedules"
              };

          function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }

          const scheduleStatusForShowing =
            employee.isVerified === true
              ? scheduleStatus.status === "WORKING"
                ? scheduleStatus.floor
                : scheduleStatus.status === "HOLIDAY" ||
                  scheduleStatus.status === "DAY_OFF"
                ? capitalizeFirstLetter(
                    scheduleStatus.status.replace("_", "-").toLowerCase()
                  )
                : "No schedules"
              : "Waiting Invite";

          const hasScheduleInDB = scheduleStatus.status !== "NoSchedules";
          const isHolidayOrDayOff =
            scheduleStatus.status === "HOLIDAY" || scheduleStatus.status === "DAY_OFF";

          const succes = () =>
            toast.success("Succes!", {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });

          const eroare = (text) =>
            toast.error(text, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });

          const handleDeleteUser = async (employeeId) => {
            try {
              await deleteUser(employeeId);
              succes();
              props.setNewFetch((prevState) => !prevState);
            } catch (error) {
              eroare(error);
            }
          };

          return (
            <div key={employee.id} className={classes.StaffMembersWorker}>
              <div className={`${classes.WorkerHead} ${
                scheduleStatus.isLoggedIn ? classes.LoggedIn : ''
              }`}>
                {employee.isVerified === true ? (
                  <div className={classes.EmployeeImageContainer}>
                    <img
                      className={classes.StaffMembersEmployeeImage}
                      src={
                        employee.avatar?.startsWith("avatar_")
                          ? require(`../../assets/${employee?.avatar}`).default
                          : employee?.avatar !== null &&
                            !employee?.avatar?.startsWith("avatar_")
                          ? employee?.avatarUrl
                          : DEFAULT_IMAGE
                      }
                      alt={employee.username}
                    />
                    <div className={classes.ScheduleIcon}>
                      {scheduleIcons[scheduleStatus.status] &&
                        scheduleIcons[scheduleStatus.status].scheduleIcon && (
                          <img
                            src={
                              scheduleIcons[scheduleStatus.status]
                                .scheduleIcon as string
                            }
                            alt={scheduleStatus.status}
                          />
                        )}
                    </div>
                  </div>
                ) : (
                  <div className={classes.EmployeeImageContainer}>
                    <img
                      className={classes.StaffMembersEmployeeImage}
                      src={DEFAULT_IMAGE}
                      alt="Default"
                    />
                    <div className={classes.ScheduleIcon}>
                      {!hasScheduleInDB && employee.isVerified
                        ? scheduleIcons["NoSchedules"].scheduleIcon && (
                            <img
                              src={scheduleIcons["NoSchedules"].scheduleIcon}
                              alt="NoSchedules"
                            />
                          )
                        : scheduleIcons["Waiting Invite"].scheduleIcon && (
                            <img
                              src={scheduleIcons["Waiting Invite"].scheduleIcon}
                              alt="Waiting Invite"
                            />
                          )}
                      {isHolidayOrDayOff &&
                        scheduleIcons[scheduleStatus.status] &&
                        scheduleIcons[scheduleStatus.status].scheduleIcon && (
                          <img
                            src={
                              scheduleIcons[scheduleStatus.status]
                                .scheduleIcon as string
                            }
                            alt={scheduleStatus.status}
                          />
                        )}
                      {scheduleStatus.status === "WORKING" &&
                        scheduleIcons[scheduleStatus.status] &&
                        scheduleIcons[scheduleStatus.status].scheduleIcon && (
                          <img
                            src={
                              scheduleIcons[scheduleStatus.status]
                                .scheduleIcon as string
                            }
                            alt={scheduleStatus.status}
                          />
                        )}
                    </div>
                  </div>
                )}
                {employee.isVerified === false ? (
                  <button
                    className={classes.EditWorkerButton}
                    onClick={() => {
                      handleDeleteUser(employee.id);
                    }}
                  >
                    <div
                      className={classes.EditWorkerIcon}
                      style={{ color: "#020202" }}
                    >
                      {deleteIcon}
                    </div>
                  </button>
                ) : (
                  <button
                    className={classes.EditWorkerButton}
                    onClick={() => {
                      props.handleEmployeeClick(employee.id);
                    }}
                  >
                    <div className={classes.EditWorkerIcon}>
                      {EditWorkerIcon}
                    </div>
                  </button>
                )}
              </div>
              <div className={classes.WorkerContent}>
                <div className={classes.WorkerContentTitle}>
                  <div className={classes.WorkerContentTitleTextContainer}>
                    <p className={classes.WorkerContentTitleText}>
                      {employee.username}
                    </p>
                  </div>
                  <div
                    className={`${classes.WorkerTag} ${
                      scheduleStatus.status &&
                      scheduleIcons[scheduleStatus.status] &&
                      classes[scheduleStatus.status]
                    }`}
                  >
                    {scheduleIcons[scheduleStatus.status] &&
                      scheduleIcons[scheduleStatus.status].tagIcon && (
                        <div className={classes.TagIcon}>
                          <img
                            className={classes.TagIconImage}
                            src={
                              scheduleIcons[scheduleStatus.status].tagIcon as string
                            }
                            alt="Tag Icon"
                          />
                        </div>
                      )}
                    <p className={classes.WorkerTagText}>
                      {scheduleStatus.status === "WORKING" ? 
                        `Check In (${formatTime(activeSchedule?.checkinTime)})` :
                        scheduleStatusForShowing}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={classes.StaffMembersContainer}>
      <div className={classes.StaffMembersHead}>
        <div className={classes.StaffMembersHeading}>
          <Title
            title="Staff members"
            subtitle={`${props.employees.length} employees`}
          />
        </div>
        <div className={classes.StaffMembersHeadActions}>

        <Link
                      to="/staff/list-view"
                      state={{
                        employees: props.employees,
                      }}
          >
          <Button
              startIcon={ListViewIcon}
              variant="outlined"
              size="large"
              className={classes.calendarButton}
              style={{ color: calendarColor }}
              disableRipple
            >
              <Typography className={classes.calendarButtonText}>
                List View
              </Typography>
            </Button> 

          </Link>
          <Link
            to="/staff/overview-calendar"
            state={{
              employees: props.employees,
            }}
          >
            <Button
              startIcon={calendarIcon}
              variant="outlined"
              size="large"
              className={classes.calendarButton}
              style={{ color: calendarColor }}
              disableRipple
            >
              <Typography className={classes.calendarButtonText}>
                Overview calendar
              </Typography>
            </Button>
          </Link>
          <AddEmployeeButton
            text="Add new employee"
            isModalOpen={props.isModalOpen}
            setIsModalOpen={props.setIsModalOpen}
          />
        </div>
      </div>
      <div className={classes.RowsContainer}>{GenerateEmployeeRows()}</div>
    </div>
  );
};

export default StaffMembers;
