import { format } from "date-fns";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  ClassNames,
  DayPicker,
  DayProps,
  useDayRender,
} from "react-day-picker";
import { useDispatch } from "react-redux";
import {
  arrowLeftIcon,
  arrowRightIcon,
  bonusIcon,
  closeIcon,
  leftArrowIcon,
  timeIcon,
  walletIcon,
  spreadIcon,
} from "../../../icons/icons";
import { reservationShowComponentActions } from "../../../store/reservationShowComponent";
import OutsideClickHandler from "../components/OutsideClickHandler";
import { Employee } from "../StaffTypes";
import classes from "./TimeTable.module.css";
import { createPortal } from 'react-dom';

type Props = {
  employee: Employee;
  onBack: (tab: string) => void;
  onClose: () => void;
};

const TimeTable = ({ employee, onBack, onClose }: Props) => {
  const employeeBoxRef = useRef<HTMLDivElement | null>(null);
  const dropdownPortalRef = useRef<HTMLDivElement | null>(null);

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

  const datepicker = (
    <div className={classes.date_picker}>
      <div
        onClick={() => subtractMonth(currentDate.clone())}
        className={classes.DatePickerArrow}
      >
        {arrowLeftIcon}
      </div>
      <div className={classes.date_value}>
        {currentDate.format("MMMM, YYYY")}
      </div>
      <div
        onClick={() => addMonth(currentDate.clone())}
        className={classes.DatePickerArrow}
      >
        {arrowRightIcon}
      </div>
    </div>
  );

  const classNames: ClassNames = {
    ...classes,
    caption: classes.caption,
    head: classes.head,
    tbody: classes.tbody,
    head_row: classes.HeadRow,
    row: classes.row,
    head_cell: classes.HeadCell,
    cell: classes.Cell,
    day: classes.Day,
    day_outside: classes.DayOutside,
  };

  const formatWeekdayName = (date: Date, options?: { locale?: Locale }) => {
    return format(date, "EEEE", options);
  };

  const [activeDropdown, setActiveDropdown] = useState<Date | null>(null);

  function Day(props: DayProps) {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const dayRender = useDayRender(props.date, props.displayMonth, buttonRef);
    const isDropdownOpen = activeDropdown?.getTime() === props.date.getTime();

    const getDaySchedule = () => {
      if (!employee.staffSchedules) return null;
      
      return employee.staffSchedules.find(schedule => 
        moment(props.date).isSame(moment(schedule.date), "day")
      );
    };

    const formatTime = (timeString: string | undefined | null) => {
      if (!timeString) return '—';
      return new Date(timeString).toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC'
      });
    };

    const renderDropdown = () => {
      if (!isDropdownOpen || !buttonRef.current || !dropdownPortalRef.current) return null;

      const rect = buttonRef.current.getBoundingClientRect();
      const containerRect = dropdownPortalRef.current.getBoundingClientRect();
      const schedule = getDaySchedule();
      
      return createPortal(
        <div 
          className={classes.SpreadDropdown}
          style={{
            position: 'absolute',
            top: (rect.bottom - containerRect.top) - 65,
            left: (rect.right - containerRect.left) - 90,
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className={classes.SpreadDropdownItem}>
             In: {formatTime(schedule?.checkinTime)}
          </div>
          <div className={classes.SpreadDropdownItem}>
            Check Out: {formatTime(schedule?.checkoutTime)}
          </div>
          <div className={classes.SpreadDropdownItem}>
            Hours: {schedule?.workedHours ? formatTimeToHHMMSS(Number(schedule.workedHours)) : '—'}
          </div>
        </div>,
        dropdownPortalRef.current
      );
    };

    const baseContent = (
      <ClickOutsideWrapper 
        buttonRef={buttonRef}
        onClickOutside={() => setActiveDropdown(null)}
      >
        <div className={classes.CalendarDate}>
          <div className={classes.CalendarDateText}>
            {props.date.getDate()}
          </div>
        </div>
        <span 
          className={classes.SpreadIcon} 
          onClick={(e) => {
            e.stopPropagation();
            setActiveDropdown(isDropdownOpen ? null : props.date);
          }}
        >
          {spreadIcon}
        </span>
        {renderDropdown()}
      </ClickOutsideWrapper>
    );

    if (!employee.staffSchedules || employee.staffSchedules.length === 0) {
      return (
        <button ref={buttonRef} {...dayRender.buttonProps}>
          {baseContent}
        </button>
      );
    }

    const workingSchedule = employee.staffSchedules.find(
      (schedule) =>
        moment(props.date).isSame(moment(schedule.date), "day") &&
        schedule.status === "WORKING" &&
        schedule.workedHours
    );

    if (workingSchedule) {
      const { workedHours, workHours, checkinTime, checkoutTime } = workingSchedule;
      const overlayHeight = `${(workedHours / workHours) * 98}px`;
      const overlayBackgroundColor =
        workedHours / workHours <= 0.49
          ? "rgba(242, 54, 54, 0.15)"
          : workedHours / workHours <= 0.99
          ? "rgba(254, 152, 0, 0.15)"
          : workedHours / workHours === 1
          ? "rgba(18, 102, 79, 0.10)"
          : "rgba(151, 71, 255, 0.10)";

      const daySchedule = employee.staffSchedules.find(schedule => 
        moment(props.date).isSame(moment(schedule.date), "day")
      );

      const formatTimeWithDefault = (timeString: string | undefined | null) => {
        if (!timeString || timeString === '') return '00:00:00';
        return formatTime(timeString);
      };

      return (
        <button 
          ref={buttonRef} 
          {...dayRender.buttonProps}
          style={{
            padding: 0,
            position: 'relative',
          }}
        >
          {baseContent}
          <div className={classes.WorkingHours} style={{ marginBottom: '2px' }}>
            <span className={classes.HoursText}>
              {timeToDisplay(workedHours)} / {timeToDisplay(workHours)}
            </span>
          </div>
          <div className={classes.WorkingHours} style={{ marginBottom: '2px' }}>
            <span className={classes.HoursText}>
              In: {daySchedule ? formatTimeWithDefault(daySchedule.checkinTime) : '00:00:00'}
            </span>
          </div>
          <div className={classes.WorkingHours}>
            <span className={classes.HoursText}>
              Out: {daySchedule ? formatTimeWithDefault(daySchedule.checkoutTime) : '00:00:00'}
            </span>
          </div>
          <div
            className={classes.Overlay}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: overlayHeight,
              background: overlayBackgroundColor,
              zIndex: 1,
              maxHeight: "98px",
              borderRadius: "12px",
            }}
          />
        </button>
      );
    }

    return (
      <button ref={buttonRef} {...dayRender.buttonProps}>
        {baseContent}
      </button>
    );
  }

  const [totalWorkedHours, setTotalWorkedHours] = useState(0);
  const [totalWorkHours, setTotalWorkHours] = useState(0);
  const [totalOverWorkHours, setTotalOverWorkHours] = useState(0);
  const [hourCost, setHourCost] = useState(0);

  useEffect(() => {
    // Используем Set для хранения уникальных дат
    const uniqueDates = new Set();
    
    const schedulesForCurrentMonth = employee?.staffSchedules?.filter(schedule => {
      const scheduleDate = new Date(schedule.date).toISOString().split('T')[0];
      if (new Date(schedule.date).getMonth() === currentMonth.getMonth()) {
        if (uniqueDates.has(scheduleDate)) {
          return false; // Пропускаем дубликаты
        }
        uniqueDates.add(scheduleDate);
        return true;
      }
      return false;
    });

    // Initialize variables to store the summed values
    let sumWorkedHours = 0;
    let sumWorkHours = 0;
    let sumOverWorkHours = 0;

    // Iterate through the filtered schedules and sum the values
    schedulesForCurrentMonth?.forEach((schedule) => {
      sumWorkedHours += Number(schedule.workedHours) || 0; // Handle null values by defaulting to 0
      sumWorkHours += schedule.workHours || 0;
      sumOverWorkHours += schedule.overWorkHours || 0;
    });

    // Calculate the cost of one hour
    const costOfOneHour = employee.salary / sumWorkHours;

    setTotalWorkedHours(sumWorkedHours);
    setTotalWorkHours(sumWorkHours);
    setTotalOverWorkHours(sumOverWorkHours);
    setHourCost(costOfOneHour);
  }, [employee.staffSchedules, employee.salary, currentMonth]);

  const formatTimeToHHMMSS = (hours: number): string => {
    if (!hours || isNaN(hours)) return "00:00:00";
    
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = 0; // Если секунды не нужны, всегда будет 00

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const timeToDisplay = (hours: number): string => {
    if (!hours || isNaN(hours)) return "0.00";
    
    const h = Math.floor(hours);  // целые часы
    const m = Math.round((hours - h) * 60);  // минуты
    
    return `${h}.${String(m).padStart(2, '0')}`;
  };

  function ClickOutsideWrapper({ children, onClickOutside, buttonRef }) {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (buttonRef.current && 
            !target.closest(`.${classes.SpreadIcon}`) && 
            !target.closest(`.${classes.SpreadDropdown}`)) {
          onClickOutside();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [buttonRef, onClickOutside]);

    return <>{children}</>;
  }

  return (
    <div className={classes.CalendarBox} ref={employeeBoxRef}>
      <OutsideClickHandler innerRef={employeeBoxRef} onClose={onClose} />
      <div ref={dropdownPortalRef} style={{ position: 'relative' }} />
      <div className={classes.CalendarHead}>
        <div className={classes.HeadTitle}>
          <button className={classes.BackButton} onClick={() => onBack("")}>
            <span className={classes.BackIcon}>{leftArrowIcon}</span>
          </button>
          <span className={classes.EmployeeName}>Timetable</span>
          <span className={classes.EmployeeNamePoint}>·</span>
          <span className={classes.EmployeeName}>{employee.username}</span>
        </div>
        {datepicker}

        <button className={classes.CloseButton} onClick={onClose}>
          <span className={classes.CloseIcon}>{closeIcon}</span>
        </button>
      </div>
      <div className={classes.CalendarRow}>
        <div className={classes.RowCard} style={{ background: "rgba(18, 102, 79, 0.10)" }}>
          <div className={classes.CardIcon}>
            <div className={classes.IconContent}>{timeIcon}</div>
          </div>
          <div className={classes.CardContent}>
            <span className={classes.MainCardContent}>
              {formatTimeToHHMMSS(totalWorkedHours)}
            </span>
            <div className={classes.SecondCardContent}>
              <span className={classes.SecondCardContentText}>
                total worked
              </span>
            </div>
          </div>
        </div>
        <div
          className={classes.RowCard}
          style={{
            background:
              "linear-gradient(270deg, rgba(255, 255, 255, 0.20) -1.79%, rgba(255, 255, 255, 0.00) 100%), rgba(5, 110, 198, 0.20)",
          }}
        >
          <div className={classes.CardIcon}>
            <div className={classes.IconContent}>{walletIcon}</div>
          </div>
          <div className={classes.BCardContent}>
            <div className={classes.CardContentValue}>
              <span className={classes.MainValue}>
                {isNaN((totalWorkedHours / totalWorkHours) * employee.salary)
                  ? "0"
                  : (
                      (totalWorkedHours / totalWorkHours) *
                      employee.salary
                    ).toFixed(2)}
              </span>
              <span className={classes.Currency}>MDL</span>
            </div>
            <div className={classes.SecondCardContent}>
              <span className={classes.SecondCardContentText}>
                total payment
              </span>
            </div>
          </div>
        </div>
        <div
          className={classes.RowCard}
          style={{
            background:
              "linear-gradient(270deg, rgba(255, 255, 255, 0.20) -1.79%, rgba(255, 255, 255, 0.00) 100%), rgba(54, 186, 242, 0.20)",
          }}
        >
          <div className={classes.CardIcon}>
            <div className={classes.IconContent}>{bonusIcon}</div>
          </div>
          <div className={classes.BCardContent}>
            <div className={classes.CardContentValue}>
              <span className={classes.MainValue}>
                {isNaN(hourCost * totalOverWorkHours)
                  ? "0"
                  : (hourCost * totalOverWorkHours).toFixed(2)}
              </span>
              <span className={classes.Currency}>MDL</span>
            </div>
            <div className={classes.SecondCardContent}>
              <span className={classes.SecondCardContentText}>
                overwork bonus
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.CalendarBody}>
        <DayPicker
          showOutsideDays
          ISOWeek
          mode="single"
          disableNavigation
          month={currentMonth}
          classNames={classNames}
          className={classes.Calendar}
          formatters={{ formatWeekdayName }}
          components={{ Day: Day }}
        />
      </div>
    </div>
  );
};
export default TimeTable;
