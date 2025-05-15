import moment from "moment";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  arrowLeftIcon,
  arrowRightIcon,
  calendarIcon,
  calendarIconDataUri,
  sunIconUri,
  LeftArrow,
  scanIcon,
  notificationIcon,
  dotIcon,
} from "../../../icons/icons";
import { reservationShowComponentActions } from "../../../store/reservationShowComponent";
import SimpleSelect from "../../../UI/SimpleSelect";
import classes from "./OverviewCalendar.module.css";
import CustomSelectStyles from "../EditEmployee/components/CustomSelectStyles";
import {
  ClassNames,
  DayPicker,
  DayProps,
  useDayRender,
} from "react-day-picker";
import { format } from "date-fns";
import { getAllStaffByOverviewCalendar } from "../../../auth/api/requests";
import CalendarModal from "./CalendarModal";
import dayjs from "dayjs";
import { Employee } from "../StaffTypes";
import Spinner from "../../Spinner";
import QRcode from "../components/QRcode";

type Props = {};

const OverviewCalendar = (props: Props) => {
  const [currentDate, setCurrentDate] = useState(moment());

  const [currentMonth, setCurrentMonth] = useState(currentDate.toDate());
  useEffect(() => {
    setCurrentMonth(currentDate.toDate());
  }, [currentDate]);

  const dispatch = useDispatch();
  dispatch(reservationShowComponentActions.setCurrentTable(currentDate));

  const subtractMonth = (date) => {
    dispatch(
      reservationShowComponentActions.setDate(
        currentDate.subtract(1, "M").format()
      )
    );
    setCurrentDate(date.subtract(1, "M"));
  };

  const addMonth = (date) => {
    dispatch(
      reservationShowComponentActions.setDate(currentDate.add(1, "M").format())
    );
    setCurrentDate(date.add(1, "M"));
  };

  let daytypes = [
    { value: `WORK`, label: "Working days" },
    { value: "VACATION", label: "Vacations" },
  ];

  const [dayType, setDayType] = useState(daytypes[0]);
  const handleSelectChange = (selected: any) => {
    setDayType(selected);
  };

  const [responseDataAvailable, setResponseDataAvailable] = useState(false);

  const datepicker = (
    <div className={classes.date_picker}>
      <div
        onClick={() => {
          if (responseDataAvailable) {
            subtractMonth(currentDate.clone());
            setResponseDataAvailable(false);
          }
        }}
        className={classes.DatePickerArrow}
      >
        {arrowLeftIcon}
      </div>
      <div className={classes.date_value}>
        {currentDate.format("MMMM, YYYY")}
      </div>
      <div
        onClick={() => {
          if (responseDataAvailable) {
            addMonth(currentDate.clone());
            setResponseDataAvailable(false);
          }
        }}
        className={classes.DatePickerArrow}
      >
        {arrowRightIcon}
      </div>
    </div>
  );

  const customStyles = {
    ...CustomSelectStyles,
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      width: "auto",
      height: "auto",
      padding: "0px",
      opacity: "0.35",
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      gap: "8px",
      padding: "0 16px",
      borderRadius: "12px",
      display: "flex",
      height: "52px",
      alignItems: "center",
      alignSelf: "stretch",
      border: "1px solid #EEE",
      background: "var(--brand-snow, #FFF)",
      "&:before": {
        content: '""',
        display: "inline-block",
        width: "20px",
        height: "20px",
        backgroundImage: `${
          dayType.value === "WORK"
            ? `url(${calendarIconDataUri})`
            : `url(${sunIconUri})`
        }`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      },
    }),
  };

  const [selectedDay, setSelectedDay] = useState<Date>();

  const classNames: ClassNames = {
    ...classes,
    caption: classes.caption,
    head_row: classes.HeadRow,
    head_cell: classes.HeadCell,
    cell: classes.Cell,
    day: classes.Day,
  };

  const formatWeekdayName = (date: Date, options?: { locale?: Locale }) => {
    return format(date, "EEEE", options);
  };

  const DEFAULT_IMAGE = "/staffImages/barmen.png";

  function Day(props: DayProps) {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const dayRender = useDayRender(props.date, props.displayMonth, buttonRef);

    if (employees.length !== 0) {
      const employeesWithMatchingSchedules = employees.filter((employee) => {
        return employee.staffSchedules?.some((schedule) => {
          const checkinTime = new Date(schedule.checkinTime || schedule.date);
          const scheduleDay = checkinTime.getUTCDate();
          const selectedDay = props.date.getDate();
          
          return scheduleDay === selectedDay && schedule.status === "WORKING";
        });
      });

      const employeeWithVacations = employees.filter((employee) => {
        return employee.vacations?.some((vacation) => {
          const startDate = new Date(vacation.startDate);
          const endDate = new Date(vacation.endDate);
          return props.date >= startDate && props.date <= endDate;
        });
      });

      if (employeesWithMatchingSchedules.length > 0 && dayType.value === "WORK") {
        dayRender.buttonProps = {
          ...dayRender.buttonProps,
          children: (
            <>
              <div className={classes.CalendarDate}>
                <div className={classes.CalendarDateText}>
                  {props.date.getDate()}
                </div>
              </div>
              <div className={classes.StaffContainer}>
                <div className={classes.StaffList}>
                  {employeesWithMatchingSchedules.slice(0, 3).map((employee) => (
                    <div
                      key={employee.id}
                      className={classes.StaffAvatar}
                      style={{
                        background: employee.avatar
                          ? `url(${employee.avatarUrl}), lightgray 50% / cover no-repeat`
                          : `url(${DEFAULT_IMAGE})`,
                        backgroundSize: "24px 24px",
                      }}
                    ></div>
                  ))}
                  {employeesWithMatchingSchedules.length > 3 ? (
                    <p>+ {employeesWithMatchingSchedules.length - 3}</p>
                  ) : null}
                </div>
              </div>
            </>
          ),
        };

        dayRender.buttonProps.className += " " + classes.DayWithSchedule;
      }
      if (employeeWithVacations.length > 0 && dayType.value === "VACATION") {
        dayRender.buttonProps = {
          ...dayRender.buttonProps,
          children: (
            <>
              <div className={classes.CalendarDate}>
                <div className={classes.CalendarDateText}>
                  {props.date.getDate()}
                </div>
              </div>
              <div className={classes.StaffContainer}>
                <div className={classes.StaffList}>
                  {employeeWithVacations.slice(0, 3).map((employee) => (
                    <div
                      key={employee.id}
                      className={classes.StaffAvatar}
                      style={{
                        background: employee.avatar
                          ? `url(${employee.avatarUrl}), lightgray 50% / cover no-repeat`
                          : `url(${DEFAULT_IMAGE})`,
                        backgroundSize: "24px 24px",
                      }}
                    ></div>
                  ))}
                  {employeeWithVacations.length > 3 ? (
                    <p>+ {employeeWithVacations.length - 3}</p>
                  ) : null}
                </div>
              </div>
            </>
          ),
        };

        dayRender.buttonProps.className += " " + classes.dayWithVacation;
      }
    }
    return <button ref={buttonRef} {...dayRender.buttonProps} />;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [scheduledEmployees, setScheduledEmployees] = useState<any[]>([]);
  const [vacationsEmployees, setVacationsEmployees] = useState<any[]>([]);

  const handleDayClick = (day: Date) => {
    const selectedDate = new Date(day);
    setSelectedDay(selectedDate);
    setIsModalOpen(true);

    if (employees.length !== 0) {
      const employeesWithMatchingSchedules = employees.filter((employee) => {
        return employee.staffSchedules?.some((schedule) => {
          const checkinTime = new Date(schedule.checkinTime || schedule.date);
          const scheduleDay = checkinTime.getUTCDate();
          const selectedDay = selectedDate.getDate();
          return scheduleDay === selectedDay && schedule.status === "WORKING";
        });
      });

      const employeeWithVacations = employees.filter((employee) => {
        return employee.vacations?.some((vacation) => {
          const startDate = new Date(vacation.startDate);
          const endDate = new Date(vacation.endDate);
          return selectedDate >= startDate && selectedDate <= endDate;
        });
      });

      setScheduledEmployees([...employeesWithMatchingSchedules]);
      setVacationsEmployees([...employeeWithVacations]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen((prevState) => !prevState);
    setSelectedDay(undefined);
  };

  const [previousDays, setPreviousDays] = useState(6);
  const [upcomingDays, setUpcomingDays] = useState(6);

  // useEffect(() => {
  //   const start = currentDate.toISOString();
  //   const startOfMonth = currentDate.startOf("month");
  //   const endOfMonth = currentDate.endOf("month");

  //   const firstDayOfMonth = startOfMonth.day();
  //   const daysBeforeMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  //   const lastDayOfMonth = endOfMonth.day();
  //   const daysAfterMonth = lastDayOfMonth === 6 ? 1 : 7 - lastDayOfMonth;

  //   // Assuming setPreviousDays and setUpcomingDays are functions in your component
  //   setPreviousDays(daysBeforeMonth);
  //   setUpcomingDays(daysAfterMonth);
  // }, [currentDate]);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (previousDays >= 0 && upcomingDays >= 0 && currentDate !== null) {
      const fetchAllStaff = async () => {
        try {
          const response = await getAllStaffByOverviewCalendar(
            currentDate.format("YYYY-MM"),
            previousDays,
            upcomingDays
          );
          setEmployees(response);
          setResponseDataAvailable(true); // Set the flag to true when data is available
          setTimeout(setLoading.bind(null, false), 500);
        } catch (error) {
          console.error("Can't get all Staff by Calendar:", error);
        }
      };
      fetchAllStaff();
    }
  }, [previousDays, upcomingDays, currentDate]);

  const [qrButton, setQrButton] = useState(false);

  return (
    <>
      {qrButton ? (
        <QRcode setQrButton={setQrButton} />
      ) : (
        <>
          {!loading ? (
            <div className={classes.OverRideStyle}>
              <div className={classes.CalendarHead}>
                <div className={classes.CalendarHeadHeading}>
                  <Link to="/staff">
                    <button className={classes.CalendarHeadBackButton}>
                      {LeftArrow}
                    </button>
                  </Link>
                  <h1 className={classes.CalendarHeadText}>
                    Overview calendar
                  </h1>
                </div>
                <div className={classes.CalendarHeadActions}>
                  <Col>
                    <Row
                      className={classes.header_second_col}
                      style={{ padding: 0 }}
                    >
                      <Col
                        className={classes.header_col}
                        style={{ padding: 0 }}
                      >
                        {datepicker}
                      </Col>
                      <Col className={classes.header_col}>
                        <span className={classes.selectIcon}>
                          {calendarIcon}
                        </span>
                        <SimpleSelect
                          value={dayType}
                          options={daytypes}
                          onChange={handleSelectChange}
                          styles={customStyles}
                        />
                      </Col>
                      <Col
                        className={classes.header_col}
                        style={{ width: "175px", padding: 0 }}
                      >
                        <button
                          className={classes.ScanButton}
                          onClick={() => setQrButton(true)}
                        >
                          <span className={classes.ScanIcon}>{scanIcon}</span>
                          <span className={classes.ScanText}>Scan Worker</span>
                        </button>
                      </Col>
                      <Col
                        className={classes.header_col}
                        style={{ width: "64px", padding: "0px" }}
                      >
                        <button className={classes.NotificationsButton}>
                          <span style={{ width: "24px", height: "24px" }}>
                            {notificationIcon}
                          </span>
                          <span
                            className={classes.NotificationDot}
                            style={{ color: "#F23636" }}
                          >
                            {dotIcon}
                          </span>
                        </button>
                      </Col>
                    </Row>
                  </Col>
                </div>
              </div>
              <div className={classes.CalendarBody}>
                <DayPicker
                  showOutsideDays
                  ISOWeek
                  mode="single"
                  selected={selectedDay}
                  onSelect={setSelectedDay}
                  disableNavigation
                  month={currentMonth}
                  classNames={classNames}
                  className={classes.Calendar}
                  formatters={{ formatWeekdayName }}
                  components={{ Day: Day }}
                  onDayClick={handleDayClick}
                />
                {isModalOpen && (
                  <CalendarModal
                    onClose={handleModalClose}
                    clickedDay={
                      selectedDay !== undefined ? selectedDay : new Date()
                    }
                    dayType={dayType.value}
                    employeesWithSchedules={scheduledEmployees}
                    employeesWithVacations={vacationsEmployees}
                  />
                )}
              </div>
            </div>
          ) : null}
        </>
      )}
      <Spinner loading={loading} />
    </>
  );
};

export default OverviewCalendar;
